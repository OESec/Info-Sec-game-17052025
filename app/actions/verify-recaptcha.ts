"use server"

/**
 * Verifies a reCAPTCHA token with Google's API
 */
export async function verifyReCAPTCHA(token: string): Promise<boolean> {
  try {
    // Skip verification in development if no secret key is available or if using the mock token
    if (process.env.NODE_ENV === "development") {
      if (!process.env.RECAPTCHA_SECRET_KEY || token === "mock-token-for-development") {
        console.warn("RECAPTCHA_SECRET_KEY not set or using mock token, skipping verification in development")
        return true
      }
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not set")
      // In production, fail closed (return false) if the secret key is missing
      // In development, allow the verification to pass
      return process.env.NODE_ENV === "development"
    }

    // Skip verification for mock tokens in development
    if (process.env.NODE_ENV === "development" && token === "mock-token-for-development") {
      return true
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      return true
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return false
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    // In production, fail closed (return false) on errors
    // In development, allow the verification to pass if there's an error
    return process.env.NODE_ENV === "development"
  }
}
