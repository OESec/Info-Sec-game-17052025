"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScenarioCard } from "@/components/scenario-card"
import { TimeRestrictionDialog } from "@/components/time-restriction-dialog"
import { scenarios } from "@/data/scenarios"
import { Shield, RefreshCw } from "lucide-react"

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
  const formRef = useRef<HTMLFormElement>(null)

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userAnswer.trim() || userAnswer.length > MAX_CHAR_LENGTH) {
      return
    }

    setSubmitted(true)
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

      // Update the last scenario time
      setLastScenarioTime(currentTime)
      localStorage.setItem("lastScenarioTime", currentTime.toString())
    }
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleNewScenario}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Scenario
              </Button>
              <Button type="submit">Submit Analysis</Button>
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
