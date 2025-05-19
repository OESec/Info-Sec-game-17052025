import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { RealWorldScenario } from "@/components/real-world-scenario"
import type { Scenario } from "@/types/scenario"

interface ScenarioCardProps {
  scenario: Scenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-400" />
          <CardTitle className="text-red-700 dark:text-red-400">Security Incident: {scenario.title}</CardTitle>
        </div>
        <CardDescription className="text-red-600/80 dark:text-red-400/80">
          {scenario.organization} | {scenario.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert prose-red">
          <p className="text-slate-700 dark:text-slate-300">{scenario.description}</p>

          <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-md border border-red-200 dark:border-red-900">
            <h4 className="text-red-700 dark:text-red-400 font-medium mb-1">Impact:</h4>
            <p className="text-slate-700 dark:text-slate-300">{scenario.impact}</p>
          </div>

          {/* Real-world scenario search placed here, after the impact section */}
          <RealWorldScenario scenario={scenario} />
        </div>
      </CardContent>
    </Card>
  )
}
