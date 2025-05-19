"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { AlertCircle } from "lucide-react"
import { getRecaptchaConfig, getReCaptchaHTML } from "@/app/actions/get-recaptcha-config"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  className?: string
  invisible?: boolean
}

export function ReCAPTCHA({ onVerify, onExpire, onError, className, invisible = true }: ReCAPTCHAProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isConfigured, setIsConfigured] = useState<boolean>(false)
  const [recaptchaHTML, setRecaptchaHTML] = useState<string>("")

  // Fetch configuration and HTML from the server
  useEffect(() => {
    async function fetchConfig() {
      try {
        // Get configuration status
        const config = await getRecaptchaConfig()
        setIsConfigured(config.isConfigured)

        // Get the HTML with the site key embedded (server-side only)
        if (config.isConfigured) {
          const htmlResult = await getReCaptchaHTML(invisible)
          setRecaptchaHTML(htmlResult.html)
        }
      } catch (err) {
        console.error("Error fetching reCAPTCHA config:", err)
        setError("Failed to load reCAPTCHA configuration")
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [invisible])

  // Function to execute reCAPTCHA (for invisible mode)
  const executeReCaptcha = () => {
    if (widgetId.current !== null && window.grecaptcha && window.grecaptcha.execute) {
      try {
        window.grecaptcha.execute(widgetId.current)
      } catch (err) {
        console.error("Error executing reCAPTCHA:", err)
        setError("Failed to execute reCAPTCHA. Please try refreshing the page.")
        if (onError) onError()
      }
    }
  }

  // Expose the execute function to the window for form submission
  useEffect(() => {
    if (invisible) {
      window.executeReCaptcha = executeReCaptcha
    }
    return () => {
      if (invisible && window.executeReCaptcha === executeReCaptcha) {
        delete window.executeReCaptcha
      }
    }
  }, [invisible])

  useEffect(() => {
    // If reCAPTCHA is not configured, provide a mock verification in development
    if (!isConfigured) {
      if (!isLoading) {
        setError("reCAPTCHA is not configured. Form submission will work without verification in development.")
        // Provide a mock verification in development
        if (process.env.NODE_ENV === "development") {
          onVerify("mock-token-for-development")
        }
      }
      return
    }

    if (!isScriptLoaded || !containerRef.current || !recaptchaHTML) {
      return // Wait for script to load and HTML to be set
    }

    // Define the callback function for when reCAPTCHA is ready
    const renderReCaptcha = () => {
      if (containerRef.current && window.grecaptcha) {
        try {
          setIsLoading(false)
          // Find the g-recaptcha div inside our container
          const recaptchaElement = containerRef.current.querySelector(".g-recaptcha")

          if (recaptchaElement) {
            widgetId.current = window.grecaptcha.render(recaptchaElement, {
              callback: onVerify,
              "expired-callback": onExpire,
              "error-callback": () => {
                setError("reCAPTCHA encountered an error. Please try refreshing the page.")
                if (onError) onError()
              },
              theme: "light",
              size: invisible ? "invisible" : "normal",
            })
          }
        } catch (err) {
          console.error("Error rendering reCAPTCHA:", err)
          setError("Failed to load reCAPTCHA. Please try refreshing the page.")
          setIsLoading(false)
          if (onError) onError()
        }
      }
    }

    // If grecaptcha is already loaded, render immediately
    if (window.grecaptcha && window.grecaptcha.render) {
      renderReCaptcha()
    } else {
      // Set up the callback for when grecaptcha loads
      window.onRecaptchaLoad = renderReCaptcha
    }

    return () => {
      // Clean up
      if (widgetId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (err) {
          console.error("Error resetting reCAPTCHA:", err)
        }
      }
    }
  }, [onVerify, onExpire, onError, isScriptLoaded, invisible, isLoading, isConfigured, recaptchaHTML])

  // If we're in development and reCAPTCHA is not configured, return a mock component
  if (!isConfigured && process.env.NODE_ENV === "development") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 p-3 text-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            {invisible
              ? "Invisible reCAPTCHA is disabled in development mode. Add reCAPTCHA keys to enable it."
              : "reCAPTCHA is disabled in development mode. Add reCAPTCHA keys to enable it."}
          </span>
        </div>
      </div>
    )
  }

  const handleScriptLoad = () => {
    setIsScriptLoaded(true)
  }

  return (
    <div className={className}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={() => {
          setError("Failed to load reCAPTCHA script. Please check your internet connection.")
          setIsLoading(false)
          if (onError) onError()
        }}
      />

      {isLoading && !invisible && (
        <div className="flex justify-center items-center h-[78px] bg-slate-100 dark:bg-slate-800 rounded-md">
          <div className="animate-pulse text-sm text-slate-500 dark:text-slate-400">Loading reCAPTCHA...</div>
        </div>
      )}

      {/* Use dangerouslySetInnerHTML to insert the server-generated HTML with the site key */}
      <div
        ref={containerRef}
        className={isLoading && !invisible ? "hidden" : ""}
        dangerouslySetInnerHTML={{ __html: recaptchaHTML }}
      />

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Add global type definitions
declare global {
  interface Window {
    onRecaptchaLoad: () => void
    executeReCaptcha?: () => void
    grecaptcha: {
      render: (
        container: HTMLElement,
        parameters: {
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark"
          size?: "normal" | "compact" | "invisible"
        },
      ) => number
      reset: (widgetId: number) => void
      execute: (widgetId: number) => void
    }
  }
}
