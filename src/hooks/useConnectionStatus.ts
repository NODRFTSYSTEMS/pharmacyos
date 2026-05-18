import { useEffect, useRef, useState } from 'react'

interface ConnectionStatus {
  online: boolean
  lastChangedAt: Date
}

// Heartbeat interval in ms. 30 s gives a timely but non-spammy signal.
const HEARTBEAT_INTERVAL_MS = 30_000
// URL to ping — Supabase project health endpoint never requires auth.
// Fall back to a tiny public resource if the env var is unavailable.
const PING_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)
    ? `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/?apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    : 'https://www.google.com/favicon.ico'

async function checkActualConnectivity(): Promise<boolean> {
  try {
    // HEAD request — no body downloaded; fast and unambiguous.
    const res = await fetch(PING_URL, {
      method:  'HEAD',
      cache:   'no-store',
      signal:  AbortSignal.timeout(5_000), // 5-second hard timeout
    })
    return res.ok || res.status < 500
  } catch {
    return false
  }
}

function getInitialStatus(): ConnectionStatus {
  // navigator.onLine is only used for the optimistic initial state.
  // The first heartbeat will correct it within HEARTBEAT_INTERVAL_MS.
  return {
    online:        typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChangedAt: new Date(),
  }
}

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>(getInitialStatus)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function applyOnline(online: boolean) {
    setStatus(prev => {
      if (prev.online === online) return prev   // no re-render if unchanged
      return { online, lastChangedAt: new Date() }
    })
  }

  // Run an immediate heartbeat then schedule periodic ones
  async function runHeartbeat() {
    const reachable = await checkActualConnectivity()
    applyOnline(reachable)
  }

  useEffect(() => {
    // Browser events provide near-instant offline detection
    function handleOnline()  { void runHeartbeat() }
    function handleOffline() { applyOnline(false) }
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    // First check immediately on mount — corrects navigator.onLine false-positive
    void runHeartbeat()

    // Periodic heartbeat catches silent connectivity loss (e.g. ISP outage
    // without the NIC dropping) that browser events never fire for.
    timerRef.current = setInterval(() => { void runHeartbeat() }, HEARTBEAT_INTERVAL_MS)

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timerRef.current !== null) clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return status
}
