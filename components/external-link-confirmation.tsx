"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Lock, AlertTriangle, ShieldAlert } from "lucide-react"
import { trackExternalLinkClick } from "@/lib/security-analytics"

interface ExternalLinkConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  url: string
  title: string
  hostname?: string
  isSecure?: boolean
}

export function ExternalLinkConfirmation({
  isOpen,
  onClose,
  onConfirm,
  url,
  title,
  hostname: propHostname,
  isSecure: propIsSecure,
}: ExternalLinkConfirmationProps) {
  // Enhanced function to check if a hostname is an IP address
  const isIpAddress = (hostname: string): boolean => {
    // Check for IPv4
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/

    // Check for various forms of IPv6
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    const ipv6LooseRegex = /^[0-9a-fA-F:]+$/

    // Check for numeric patterns that might be IP-like
    const numericPattern = /^\d+\.\d+/

    return (
      ipv4Regex.test(hostname) ||
      ipv6Regex.test(hostname) ||
      ipv6LooseRegex.test(hostname) ||
      numericPattern.test(hostname)
    )
  }

  // Parse the URL to get information about it if not provided in props
  let hostname = propHostname || ""
  let isSecure = propIsSecure !== undefined ? propIsSecure : false
  let isValid = true

  // If hostname wasn't provided in props, try to parse it from the URL
  if (!hostname) {
    try {
      const parsedUrl = new URL(url)
      hostname = parsedUrl.hostname
      isSecure = parsedUrl.protocol === "https:"
    } catch (error) {
      isValid = false
    }
  }

  // Check if the hostname is an IP address and add a warning
  const isIpAddressUrl = hostname ? isIpAddress(hostname) : false

  const handleClose = () => {
    trackExternalLinkClick(url, false)
    onClose()
  }

  const handleConfirm = () => {
    trackExternalLinkClick(url, true)
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-amber-500" />
            External Link Confirmation
          </DialogTitle>
          <DialogDescription>
            You are about to leave the InfoSec Challenge and visit an external website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="mt-0.5">
              {isSecure ? (
                <Lock className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">
                {isValid ? (
                  <>
                    You are navigating to:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{hostname}</span>
                  </>
                ) : (
                  "Invalid URL"
                )}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">{title}</p>
              <div className="text-xs font-mono bg-slate-200 dark:bg-slate-700 p-2 rounded break-all">{url}</div>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p>
                Always verify the URL before proceeding to external websites. This is a good security practice to avoid
                phishing attacks.
              </p>
            </div>
            {!isSecure && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400">
                  Warning: This site does not use a secure connection (HTTPS).
                </p>
              </div>
            )}
            {isIpAddressUrl && (
              <div className="flex items-start gap-2 mt-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400">
                  Warning: This URL uses an IP address instead of a domain name. This is often associated with malicious
                  sites.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className={isSecure ? "" : "bg-amber-600 hover:bg-amber-700"}>
            Continue to Website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
