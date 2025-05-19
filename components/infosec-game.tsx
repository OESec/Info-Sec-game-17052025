"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScenarioCard } from "@/components/scenario-card"
import { TimeRestrictionDialog } from "@/components/time-restriction-dialog"
import { ReCAPTCHA } from "@/components/recaptcha"
import { scenarios } from "@/data/scenarios"
import { Shield, RefreshCw, AlertCircle } from "lucide-react"
import { verifyReCAPTCHA } from "@/app/actions/verify-recaptcha"
import { useToast } from "@/hooks/use-toast"
import { getRecaptchaConfig } from "@/app/actions/get-recaptcha-config"

// Add a helper function to format time remaining
function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`
}

const MAX_CHAR_LENGTH = 1000

export function InfoSecGame() {
  const [currentScenario, setCurrentScenario] = useState(() => {
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [lastScenarioTime, setLastScenarioTime] = useState<number>(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecaptchaConfigured, setIsRecaptchaConfigured] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  // Check if reCAPTCHA is configured using the server action
  useEffect(() => {
    async function checkRecaptchaConfig() {
      try {
        const config = await getRecaptchaConfig()
        setIsRecaptchaConfigured(config.isConfigured)
      } catch (error) {
        console.error("Error checking reCAPTCHA configuration:", error)
        setIsRecaptchaConfigured(false)
      }
    }

    checkRecaptchaConfig()
  }, [])

  // Load the last scenario time from localStorage on component mount
  useEffect(() => {
    const storedTime = localStorage.getItem("lastScenarioTime")
    if (storedTime) {
      setLastScenarioTime(Number.parseInt(storedTime, 10))
    } else {
      // If no stored time, set current time and save it
      const currentTime = Date.now()
      setLastScenarioTime(currentTime)
      localStorage.setItem("lastScenarioTime", currentTime.toString())
    }
  }, [])

  // This function is called when the reCAPTCHA verification is complete
  const handleRecaptchaVerify = async (token: string) => {
    setRecaptchaToken(token)
    setVerificationError(null)

    // If we're in the process of submitting the form, continue with submission
    if (isSubmitting) {
      await processFormSubmission(token)
    }
  }

  // Process the form submission with the reCAPTCHA token
  const processFormSubmission = async (token: string) => {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Verify the reCAPTCHA token
      const isValid = await verifyReCAPTCHA(token)

      if (isValid) {
        setSubmitted(true)
        setVerificationError(null)
      } else {
        setVerificationError("reCAPTCHA verification failed. Please try again.")
        // Reset reCAPTCHA
        if (window.grecaptcha) {
          try {
            window.grecaptcha.reset()
          } catch (err) {
            console.error("Error resetting reCAPTCHA:", err)
          }
        }
        setRecaptchaToken(null)
      }
    } catch (error) {
      console.error("Error during verification:", error)
      setVerificationError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
      setIsSubmitting(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userAnswer.trim() || userAnswer.length > MAX_CHAR_LENGTH) {
      return
    }

    // Set submitting state
    setIsSubmitting(true)

    // If we already have a token (or we're in development without reCAPTCHA), process the submission
    if (recaptchaToken || (!isRecaptchaConfigured && process.env.NODE_ENV === "development")) {
      await processFormSubmission(recaptchaToken || "mock-token-for-development")
      return
    }

    // If reCAPTCHA is configured and we're in production, execute it
    if (isRecaptchaConfigured && window.executeReCaptcha && process.env.NODE_ENV !== "development") {
      window.executeReCaptcha()
    } else {
      // If reCAPTCHA is not available or we're in development, proceed without it
      await processFormSubmission("mock-token-for-development")
    }
  }

  const handleNewScenario = () => {
    const currentTime = Date.now()
    const timeDifference = currentTime - lastScenarioTime
    const fifteenMinutes = 15 * 60 * 1000 // 15 minutes in milliseconds

    if (timeDifference < fifteenMinutes) {
      // Less than 15 minutes have passed
      const remaining = fifteenMinutes - timeDifference
      setTimeRemaining(formatTimeRemaining(remaining))
      setDialogOpen(true)
    } else {
      // More than 15 minutes have passed, allow new scenario
      const newScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      setCurrentScenario(newScenario)
      setUserAnswer("")
      setSubmitted(false)
      setRecaptchaToken(null)
      setVerificationError(null)

      // Update the last scenario time
      setLastScenarioTime(currentTime)
      localStorage.setItem("lastScenarioTime", currentTime.toString())
    }
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
    toast({
      title: "reCAPTCHA Expired",
      description: "The reCAPTCHA verification has expired. Please try submitting again.",
      variant: "destructive",
    })
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken(null)
    toast({
      title: "reCAPTCHA Error",
      description: "There was an error with reCAPTCHA. Please refresh the page and try again.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <ScenarioCard scenario={currentScenario} />

      {!submitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Your Analysis
            </CardTitle>
            <CardDescription>
              What security issues do you identify in this scenario? How could this attack have been prevented?
            </CardDescription>
          </CardHeader>
          <form ref={formRef} onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Type your analysis here..."
                  className="min-h-[150px] resize-none"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  required
                  maxLength={MAX_CHAR_LENGTH}
                />
                <div
                  className={`text-xs absolute bottom-2 right-2 ${
                    userAnswer.length > MAX_CHAR_LENGTH * 0.8
                      ? userAnswer.length > MAX_CHAR_LENGTH
                        ? "text-red-500 dark:text-red-400"
                        : "text-amber-500 dark:text-amber-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {userAnswer.length}/{MAX_CHAR_LENGTH}
                </div>
              </div>

              {/* Invisible reCAPTCHA */}
              <div className="flex flex-col items-center">
                <ReCAPTCHA
                  onVerify={handleRecaptchaVerify}
                  onExpire={handleRecaptchaExpire}
                  onError={handleRecaptchaError}
                  invisible={true}
                  className="mx-auto"
                />
                {verificationError && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleNewScenario}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Scenario
              </Button>
              <Button type="submit" disabled={isVerifying || isSubmitting}>
                {isVerifying || isSubmitting ? "Verifying..." : "Submit Analysis"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30">
          <CardHeader>
            <CardTitle className="text-emerald-700 dark:text-emerald-400">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-700 dark:text-emerald-400">
              Your analysis has been submitted. A security tutor will review your response and provide feedback soon.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewScenario} className="w-full">
              Try Another Scenario
            </Button>
          </CardFooter>
        </Card>
      )}

      <TimeRestrictionDialog open={dialogOpen} onOpenChange={setDialogOpen} timeRemaining={timeRemaining} />
    </div>
  )
}
