import type { Scenario } from "@/types/scenario"

export interface AnalysisResult {
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  score: number
  overallFeedback: string
}

// Define key security concepts for each scenario type
const securityConcepts = {
  phishing: {
    keywords: ["phishing", "email", "verify", "domain", "authentic", "social engineering", "awareness", "training"],
    concepts: [
      "Email verification and authentication",
      "Security awareness training",
      "Verification of requests through secondary channels",
      "Email filtering and anti-phishing tools",
    ],
  },
  ransomware: {
    keywords: [
      "ransomware",
      "backup",
      "patch",
      "update",
      "segmentation",
      "air-gap",
      "antivirus",
      "endpoint",
      "malware",
    ],
    concepts: [
      "Regular security patches and updates",
      "Air-gapped or offline backup systems",
      "Network segmentation",
      "Endpoint protection and antivirus",
    ],
  },
  password: {
    keywords: ["password", "mfa", "multi-factor", "authentication", "2fa", "unique", "password manager", "credential"],
    concepts: [
      "Multi-factor authentication (MFA)",
      "Unique passwords for each account",
      "Password managers",
      "Regular password rotation",
    ],
  },
  database: {
    keywords: [
      "database",
      "misconfiguration",
      "access control",
      "authentication",
      "encryption",
      "audit",
      "monitoring",
      "security review",
    ],
    concepts: [
      "Proper access controls and authentication",
      "Regular security audits",
      "Encryption at rest and in transit",
      "Configuration management and review processes",
    ],
  },
  supplyChain: {
    keywords: [
      "supply chain",
      "vendor",
      "third-party",
      "code review",
      "integrity",
      "verification",
      "trusted source",
      "vetting",
    ],
    concepts: [
      "Vendor security assessment",
      "Code signing and integrity verification",
      "Build process security controls",
      "Trusted software sources",
    ],
  },
  network: {
    keywords: ["vpn", "encryption", "tls", "ssl", "public wifi", "man-in-the-middle", "mitm", "network security"],
    concepts: [
      "VPN usage on public networks",
      "Encrypted connections (TLS/SSL)",
      "Avoiding sensitive operations on untrusted networks",
      "Network security awareness",
    ],
  },
  insider: {
    keywords: ["insider", "access control", "dlp", "monitoring", "offboarding", "least privilege", "data loss"],
    concepts: [
      "Data Loss Prevention (DLP) tools",
      "Access control and least privilege",
      "Proper offboarding procedures",
      "User activity monitoring",
    ],
  },
  vulnerability: {
    keywords: [
      "vulnerability",
      "patch",
      "update",
      "cve",
      "emergency",
      "critical",
      "vulnerability management",
      "scanning",
    ],
    concepts: [
      "Timely patch management",
      "Vulnerability scanning and assessment",
      "Emergency patching procedures for critical vulnerabilities",
      "Patch testing and deployment processes",
    ],
  },
  physical: {
    keywords: [
      "physical",
      "tailgating",
      "badge",
      "access control",
      "visitor",
      "security guard",
      "authentication",
      "mantra",
    ],
    concepts: [
      "Physical access controls",
      "Anti-tailgating policies and training",
      "Visitor management procedures",
      "Security awareness for physical security",
    ],
  },
  mobile: {
    keywords: ["mobile", "app", "permission", "mdm", "device management", "byod", "app store", "vetting", "sandbox"],
    concepts: [
      "Mobile Device Management (MDM)",
      "App vetting and approval processes",
      "Permission reviews and least privilege",
      "BYOD security policies",
    ],
  },
}

function detectScenarioType(scenario: Scenario): keyof typeof securityConcepts {
  const title = scenario.title.toLowerCase()
  const description = scenario.description.toLowerCase()

  if (title.includes("phishing") || description.includes("phishing email")) return "phishing"
  if (title.includes("ransomware")) return "ransomware"
  if (title.includes("password")) return "password"
  if (title.includes("database")) return "database"
  if (title.includes("supply chain")) return "supplyChain"
  if (title.includes("wi-fi") || title.includes("wifi")) return "network"
  if (title.includes("insider")) return "insider"
  if (title.includes("vulnerability") || title.includes("unpatched")) return "vulnerability"
  if (title.includes("physical")) return "physical"
  if (title.includes("mobile")) return "mobile"

  // Default to phishing if unable to detect
  return "phishing"
}

function analyzeResponse(userResponse: string, scenario: Scenario): AnalysisResult {
  const scenarioType = detectScenarioType(scenario)
  const concepts = securityConcepts[scenarioType]
  const userResponseLower = userResponse.toLowerCase()

  const wordCount = userResponse.trim().split(/\s+/).length
  const hasMinimumLength = userResponse.trim().length >= 20
  const mentionedKeywords = concepts.keywords.filter((keyword) => userResponseLower.includes(keyword))

  // Detect if response is likely gibberish (no keywords at all and very short)
  const isLowQuality = !hasMinimumLength || (wordCount < 10 && mentionedKeywords.length === 0)

  if (isLowQuality) {
    return {
      strengths: [
        "Your response appears to contain non-meaningful text or lacks sufficient detail to identify security concepts",
      ],
      gaps: concepts.concepts,
      suggestions: [
        "Please provide a meaningful analysis of the security incident",
        "Consider what went wrong, what controls could have prevented it, and how to improve security",
        `Focus on key areas like: ${concepts.concepts.slice(0, 2).join(", ")}`,
      ],
      score: 0,
      overallFeedback:
        "Your response does not contain enough detail to evaluate. Please provide a thoughtful analysis of the security scenario, including what went wrong and how it could have been prevented.",
    }
  }

  // Determine which concepts were covered
  const coveredConcepts: string[] = []
  const missedConcepts: string[] = []

  concepts.concepts.forEach((concept) => {
    const conceptKeywords = concept.toLowerCase().split(" ")
    const isCovered = conceptKeywords.some((word) => userResponseLower.includes(word))
    if (isCovered) {
      coveredConcepts.push(concept)
    } else {
      missedConcepts.push(concept)
    }
  })

  // Calculate score (1-10 based on keyword coverage and concept coverage)
  const conceptCoverage = coveredConcepts.length / concepts.concepts.length
  const keywordCoverage = mentionedKeywords.length / concepts.keywords.length // Declare keywordCoverage variable
  const score = Math.round((keywordCoverage * 0.4 + conceptCoverage * 0.6) * 10)

  // Generate strengths
  const strengths: string[] = []
  if (coveredConcepts.length > 0) {
    strengths.push(`You identified key concepts: ${coveredConcepts.slice(0, 2).join(", ")}`)
  }
  if (userResponse.length > 200) {
    strengths.push("You provided a detailed and thoughtful analysis")
  }
  if (userResponseLower.includes("prevent")) {
    strengths.push("You focused on prevention strategies, which is excellent")
  }
  if (strengths.length === 0) {
    strengths.push("You provided a response and attempted to analyze the security incident")
  }

  // Generate gaps
  const gaps: string[] = missedConcepts.slice(0, 3)
  if (gaps.length === 0) {
    gaps.push("Consider exploring implementation challenges and organizational aspects")
  }

  // Generate suggestions
  const suggestions: string[] = [
    "Review security frameworks like NIST Cybersecurity Framework for comprehensive coverage",
    "Consider both technical controls and human factors in your analysis",
  ]
  if (score < 7) {
    suggestions.push(`Focus on these key areas: ${missedConcepts.slice(0, 2).join(", ")}`)
  }

  // Generate overall feedback
  let overallFeedback = ""
  if (score >= 8) {
    overallFeedback =
      "Excellent analysis! You identified most of the key security concepts and demonstrated strong understanding of the incident."
  } else if (score >= 6) {
    overallFeedback =
      "Good analysis with solid understanding. Focus on covering more specific technical controls and organizational processes to strengthen your response."
  } else {
    overallFeedback =
      "Your analysis shows security awareness, but consider exploring the technical and procedural controls in more depth for a more comprehensive evaluation."
  }

  return {
    strengths,
    gaps,
    suggestions,
    score: Math.max(1, Math.min(10, score)), // Ensure score is between 1-10
    overallFeedback,
  }
}

export async function POST(req: Request) {
  try {
    const { userResponse, scenario }: { userResponse: string; scenario: Scenario } = await req.json()

    // Analyze the response using keyword-based scoring
    const result = analyzeResponse(userResponse, scenario)

    return Response.json(result)
  } catch (error) {
    console.error("Error analyzing security response:", error)

    // Return a fallback response if analysis fails
    return Response.json({
      strengths: ["You provided a thoughtful analysis of the security scenario."],
      gaps: [
        "Consider exploring more specific technical controls that could have prevented this incident.",
        "Think about the organizational and process improvements needed beyond just technical solutions.",
      ],
      suggestions: [
        "Review common security frameworks like NIST or CIS Controls for comprehensive prevention strategies.",
        "Consider both preventive and detective controls in your analysis.",
      ],
      score: 6,
      overallFeedback:
        "Your analysis shows good security awareness. To improve, focus on identifying specific technical controls and organizational processes that address each vulnerability.",
    })
  }
}
