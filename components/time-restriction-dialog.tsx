"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface TimeRestrictionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timeRemaining: string
}

export function TimeRestrictionDialog({ open, onOpenChange, timeRemaining }: TimeRestrictionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Learning Time Restriction
          </DialogTitle>
          <DialogDescription>
            This is a learning platform designed to help you thoroughly analyze security scenarios.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Please take your time to analyze the current scenario and submit your answer, or return in {timeRemaining}.
          </p>
          <p className="text-sm text-muted-foreground">
            Each scenario requires careful consideration to develop proper security awareness.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>I understand</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
