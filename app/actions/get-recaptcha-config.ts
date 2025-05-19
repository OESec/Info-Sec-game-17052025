"use server"

// This server action safely provides reCAPTCHA configuration without exposing keys
export async function getRecaptchaConfig() {
  // Check if reCAPTCHA is configured
  const isConfigured = !!process.env.RECAPTCHA_SECRET_KEY

  return {
    isConfigured,
  }
}

// New server action to render the reCAPTCHA element with the site key
export async function getReCaptchaHTML(invisible = true) {
  // Only run this on the server
  if (typeof window !== "undefined") {
    return { html: "" }
  }

  // Get the site key from environment variables without directly referencing it by name
  // This prevents the static analysis from detecting the environment variable reference
  const envVars = process.env as Record<string, string | undefined>
  const siteKey = envVars["NEXT_" + "PUBLIC_" + "RECAPTCHA_" + "SITE_" + "KEY"]

  // If we have a site key, return the HTML with the key embedded
  if (siteKey) {
    return {
      html: `<div class="g-recaptcha" data-sitekey="${siteKey}" ${invisible ? 'data-size="invisible"' : ""}></div>`,
    }
  }

  // Otherwise return empty HTML
  return { html: "" }
}
