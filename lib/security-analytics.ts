/**
 * Tracks external link clicks for security analytics
 * This could be expanded to send data to a backend service
 */
export function trackExternalLinkClick(url: string, confirmed: boolean) {
  try {
    // Log the event to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`External link ${confirmed ? "confirmed" : "cancelled"}: ${url}`)
    }

    // In a real application, you might want to send this data to your analytics service
    // Example: await fetch('/api/analytics/external-link', { method: 'POST', body: JSON.stringify({ url, confirmed }) })

    // You could also store this in localStorage for local analytics
    const linkHistory = JSON.parse(localStorage.getItem("externalLinkHistory") || "[]")
    linkHistory.push({
      url,
      confirmed,
      timestamp: new Date().toISOString(),
    })

    // Keep only the last 50 entries to avoid localStorage size issues
    if (linkHistory.length > 50) {
      linkHistory.shift()
    }

    localStorage.setItem("externalLinkHistory", JSON.stringify(linkHistory))
  } catch (error) {
    console.error("Error tracking external link click:", error)
  }
}
