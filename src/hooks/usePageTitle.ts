import { useEffect } from 'react'

const BASE_TITLE = 'PharmacyOS'

/**
 * H-01: Sets the browser document title for the current page.
 *
 * Produces: "PharmacyOS — [pageTitle]"
 * Resets to "PharmacyOS" on unmount.
 *
 * Usage: `usePageTitle('Dashboard')` → document.title = "PharmacyOS — Dashboard"
 */
export function usePageTitle(pageTitle: string): void {
  useEffect(() => {
    document.title = `${BASE_TITLE} — ${pageTitle}`
    return () => {
      document.title = BASE_TITLE
    }
  }, [pageTitle])
}
