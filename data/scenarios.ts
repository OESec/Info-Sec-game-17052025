import type { Scenario } from "@/types/scenario"

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Phishing Email Compromise",
    organization: "Acme Financial Services",
    date: "March 2023",
    description:
      "An employee received an email that appeared to be from the CEO asking them to urgently transfer $25,000 to a new vendor account. The email address was 'ceo.acme@gmail.com' instead of the company's official domain. The employee, wanting to be responsive to the CEO's request, made the transfer immediately without verifying through another channel.",
    impact:
      "The company lost $25,000 to the scammer, and the funds could not be recovered as they had been quickly moved through multiple accounts.",
  },
  {
    id: 2,
    title: "Ransomware Attack",
    organization: "City of Riverside",
    date: "November 2022",
    description:
      "A city employee clicked on an attachment in an email claiming to be a tax document. The attachment contained ransomware that quickly spread through the network, encrypting critical files including the city's emergency services database. The city's IT systems had not been updated with the latest security patches, and there was no air-gapped backup system in place.",
    impact:
      "City services were disrupted for 2 weeks, and the city ultimately paid a $300,000 ransom to recover their data after determining that restoring from existing backups would take too long.",
  },
  {
    id: 3,
    title: "Password Reuse Breach",
    organization: "TechStart Inc.",
    date: "July 2023",
    description:
      "A developer at TechStart used the same password for their company account and for a personal forum account. The forum was breached, exposing email/password combinations. Hackers used the developer's credentials to access TechStart's code repository, as the company had not implemented multi-factor authentication for repository access.",
    impact:
      "The company's proprietary code was stolen, including unreleased features that competitors implemented before TechStart could release them, resulting in significant market share loss.",
  },
  {
    id: 4,
    title: "Unsecured Database Exposure",
    organization: "HealthTrack App",
    date: "February 2023",
    description:
      "A cloud database containing user health information was misconfigured during a routine update, removing password authentication. The database was exposed to the internet for 17 days before a security researcher discovered and reported it. The database contained names, email addresses, and health metrics of over 100,000 users.",
    impact:
      "The company faced regulatory fines for HIPAA violations, class action lawsuits from affected users, and a 40% drop in active users after the breach was disclosed.",
  },
  {
    id: 5,
    title: "Supply Chain Attack",
    organization: "Multiple Government Agencies",
    date: "December 2022",
    description:
      "A widely-used network monitoring software was compromised when attackers inserted malicious code into a software update. The software vendor's build process lacked sufficient security controls to detect the unauthorized code. Government agencies that installed the update unknowingly gave attackers access to their networks.",
    impact:
      "Sensitive government information was accessed by foreign actors, requiring months of forensic investigation and remediation efforts across dozens of federal agencies.",
  },
  {
    id: 6,
    title: "Public Wi-Fi Credential Theft",
    organization: "Individual Executive",
    date: "September 2023",
    description:
      "A company executive was working at a coffee shop and connected to the public Wi-Fi network. While checking email, they accessed the company's cloud-based project management system. Unknown to them, someone else in the coffee shop was running a man-in-the-middle attack on the Wi-Fi network, capturing unencrypted traffic.",
    impact:
      "The attacker captured the executive's session cookies and was able to access the project management system, downloading confidential information about upcoming product launches and business strategies.",
  },
  {
    id: 7,
    title: "Insider Threat Data Exfiltration",
    organization: "Research Pharmaceuticals",
    date: "April 2023",
    description:
      "An employee who had given notice of resignation was allowed to continue working with full system access during their final two weeks. During this time, they downloaded thousands of documents containing proprietary research data to a personal device. The company had no data loss prevention tools in place to detect unusual download patterns.",
    impact:
      "The employee joined a competitor and brought the research data with them, giving the competitor a significant advantage in drug development that had taken Research Pharmaceuticals years and millions of dollars to compile.",
  },
  {
    id: 8,
    title: "Unpatched Server Vulnerability",
    organization: "Online Retailer",
    date: "May 2023",
    description:
      "A critical vulnerability in the company's web server software was announced with a patch available. The IT team noted the update but scheduled it for their monthly maintenance window four weeks later. Two weeks before the scheduled update, attackers exploited the vulnerability to gain access to the company's payment processing system.",
    impact:
      "Credit card information for approximately 15,000 customers was stolen, resulting in fraudulent charges, mandatory breach notifications, and credit monitoring services that cost the company over $2 million.",
  },
  {
    id: 9,
    title: "Social Engineering Physical Breach",
    organization: "Corporate Headquarters",
    date: "August 2023",
    description:
      "An individual dressed in a delivery uniform and carrying packages tailgated an employee through a secure door. The employee held the door open for them without verifying their identity or access rights. Once inside, the unauthorized person planted rogue devices on the network and accessed unlocked computers in empty conference rooms.",
    impact:
      "The rogue devices created a backdoor into the corporate network that went undetected for weeks, allowing attackers to access sensitive financial information and intellectual property.",
  },
  {
    id: 10,
    title: "Mobile Device Compromise",
    organization: "Sales Team",
    date: "October 2023",
    description:
      "A sales representative downloaded a third-party QR code scanner app from an app store to scan codes at a trade show. The app requested extensive permissions, which the representative granted. Unknown to them, the app contained spyware that accessed their corporate email, contacts, and files stored on the device.",
    impact:
      "Customer contact information and pricing details were stolen, leading to targeted phishing attacks against customers and competitors undercutting the company's quotes with suspiciously similar pricing structures.",
  },
]
