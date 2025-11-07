"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScenarioCard } from "@/components/scenario-card"
import { TimeRestrictionDialog } from "@/components/time-restriction-dialog"
import { scenarios } from "@/data/scenarios"
import { Shield, RefreshCw, Loader2, CheckCircle2, AlertCircle, Lightbulb, Target } from "lucide-react"
import type { AnalysisResult } from "@/app/api/analyze/route"

const MAX_CHAR_LENGTH = 1000

export function InfoSecGame() {
  const [currentScenario, setCurrentScenario] = useState(() => {
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [lastScenarioTime, setLastScenarioTime] = useState<number>(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const storedTime = localStorage.getItem("lastScenarioTime")
    if (storedTime) {
      setLastScenarioTime(Number.parseInt(storedTime, 10))
    } else {
      const currentTime = Date.now()
      setLastScenarioTime(currentTime)
      localStorage.setItem("lastScenarioTime", currentTime.toString())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userAnswer.trim() || userAnswer.length > MAX_CHAR_LENGTH) {
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userResponse: userAnswer,
          scenario: currentScenario,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze response")
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error("[v0] Error analyzing response:", error)
      setAnalysisResult({
        strengths: [],
        gaps: [],
        suggestions: [],
        score: 0,
        overallFeedback: "We encountered an error analyzing your response. Please try again.",
      })
    } finally {
      setIsAnalyzing(false)
      setSubmitted(true)
    }
  }

  const handleNewScenario = () => {
    const currentTime = Date.now()
    const timeDifference = currentTime - lastScenarioTime
    const fifteenMinutes = 15 * 60 * 1000 // 15 minutes in milliseconds

    if (timeDifference < fifteenMinutes) {
      const remaining = fifteenMinutes - timeDifference
      setTimeRemaining(formatTimeRemaining(remaining))
      setDialogOpen(true)
    } else {
      const newScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      setCurrentScenario(newScenario)
      setUserAnswer("")
      setSubmitted(false)
      setAnalysisResult(null)

      setLastScenarioTime(currentTime)
      localStorage.setItem("lastScenarioTime", currentTime.toString())
    }
  }

  // Add a helper function to format time remaining
  function formatTimeRemaining(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`
  }

  return (
    <div className="space-y-6">
      <ScenarioCard scenario={currentScenario} />

      {isAnalyzing ? (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing Your Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-400">
              Our AI security tutor is evaluating your analysis. This will take just a moment...
            </p>
          </CardContent>
        </Card>
      ) : !submitted ? (
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
      ) : analysisResult ? (
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Target className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>Score: {analysisResult.score}/10 security concepts identified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Feedback */}
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm leading-relaxed">{analysisResult.overallFeedback}</p>
            </div>

            {/* Strengths */}
            {analysisResult.strengths.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  What You Identified
                </h3>
                <ul className="space-y-1.5 ml-6">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground list-disc">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {analysisResult.gaps.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  What You Missed
                </h3>
                <ul className="space-y-1.5 ml-6">
                  {analysisResult.gaps.map((gap, index) => (
                    <li key={index} className="text-sm text-muted-foreground list-disc">
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  How to Improve
                </h3>
                <ul className="space-y-1.5 ml-6">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground list-disc">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewScenario} className="w-full">
              Try Another Scenario
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <TimeRestrictionDialog open={dialogOpen} onOpenChange={setDialogOpen} timeRemaining={timeRemaining} />
    </div>
  )
}
