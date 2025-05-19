declare namespace NodeJS {
  interface ProcessEnv {
    NEWS_API_KEY?: string
    RECAPTCHA_SECRET_KEY?: string
    // Completely removed any reference to reCAPTCHA site key
  }
}
