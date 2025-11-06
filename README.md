# InfoSec Challenge

An interactive cybersecurity education platform that presents real-world security breach scenarios for analysis.

## Setting up reCAPTCHA

This application uses Google's Invisible reCAPTCHA to protect form submissions while providing a seamless user experience.

### Setting Up Invisible reCAPTCHA

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Register a new site:
   - Enter a label for your site (e.g., "InfoSec Challenge")
   - Select reCAPTCHA v2 with the "Invisible reCAPTCHA badge" option
   - Add your domain(s) to the list of allowed domains
   - Accept the terms of service
   - Click "Submit"
4. You will receive a Site Key and a Secret Key
5. Add these keys to your environment variables:
   - Site Key: For the reCAPTCHA widget
   - Secret Key: For server-side verification

For local development, you can add these to a `.env.local` file.

For production, add these environment variables to your hosting platform (e.g., Vercel).

### How Invisible reCAPTCHA Works

Invisible reCAPTCHA provides security without requiring users to check a box or solve puzzles in most cases:

1. When a user submits the form, reCAPTCHA runs in the background
2. If the user's behavior appears normal, the form submits without interruption
3. If suspicious behavior is detected, the user may be prompted to solve a CAPTCHA challenge
4. This approach provides security while maintaining a smooth user experience

### Development Mode

In development mode, if the reCAPTCHA keys are not set, the application will:
1. Display a warning message in the console
2. Allow form submissions without reCAPTCHA verification
3. Log warnings to the console

This behavior makes it easier to develop and test the application without having to set up reCAPTCHA keys immediately.

## Development

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
