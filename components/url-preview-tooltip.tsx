"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ExternalLink, Lock, AlertTriangle } from "lucide-react"
import { ExternalLinkConfirmation } from "@/components/external-link-confirmation"
import { getDomainInfo } from "@/app/actions/fetch-news"

interface UrlPreviewTooltipProps {
  href: string
  children: React.ReactNode
  className?: string
  title?: string
}

export function UrlPreviewTooltip({ href, children, className, title = "" }: UrlPreviewTooltipProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hostname, setHostname] = useState("")
  const [isSecure, setIsSecure] = useState(false)

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

  // Get domain info when the component mounts
  useEffect(() => {
    async function fetchDomainInfo() {
      try {
        // Use the async getDomainInfo function and await its result
        const domainInfo = await getDomainInfo(href)
        setHostname(domainInfo.domain)
        setIsSecure(domainInfo.isSecure)

        // Check if the hostname is an IP address and warn in console
        if (isIpAddress(domainInfo.domain)) {
          console.warn(`IP address detected in URL: ${href}`)
        }
      } catch (error) {
        console.error("Error getting domain info:", error)
        // Set defaults in case of error
        setHostname("")
        setIsSecure(false)
      }
    }

    fetchDomainInfo()
  }, [href])

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsTooltipOpen(false)
    setIsDialogOpen(true)
  }

  const handleConfirm = () => {
    setIsDialogOpen(false)
    // Open the link in a new tab
    window.open(href, "_blank", "noopener,noreferrer")
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen} delayDuration={300}>
          <TooltipTrigger
            asChild
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
            onFocus={() => setIsTooltipOpen(true)}
            onBlur={() => setIsTooltipOpen(false)}
          >
            <a href={href} onClick={handleLinkClick} className={className}>
              {children}
            </a>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="max-w-xs bg-slate-900 text-slate-100 dark:bg-slate-800 border-slate-700 p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>External Link</span>
              </div>

              <div className="flex items-start gap-1.5">
                {isSecure ? (
                  <Lock className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5" />
                )}
                <div className="text-xs break-all">
                  <div className={isSecure ? "text-emerald-400" : "text-amber-400"}>
                    {isSecure ? "Secure connection" : "Not secure"}
                  </div>
                  <div className="font-mono mt-0.5 text-slate-300">{href}</div>
                </div>
              </div>
            </div>
            {hostname && isIpAddress(hostname) && (
              <div className="mt-1 text-xs text-red-400">
                Warning: This URL uses an IP address instead of a domain name.
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ExternalLinkConfirmation
        isOpen={isDialogOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        url={href}
        title={title}
        hostname={hostname}
        isSecure={isSecure}
      />
    </>
  )
}
