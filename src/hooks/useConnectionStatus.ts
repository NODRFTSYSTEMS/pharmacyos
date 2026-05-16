import { useEffect, useState } from 'react'

interface ConnectionStatus {
  online: boolean
  lastChangedAt: Date
}

function getInitialStatus(): ConnectionStatus {
  if (typeof navigator === 'undefined') {
    return { online: true, lastChangedAt: new Date() }
  }
  return { online: navigator.onLine, lastChangedAt: new Date() }
}

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>(getInitialStatus)

  useEffect(() => {
    function updateOnline() {
      setStatus({ online: true, lastChangedAt: new Date() })
    }

    function updateOffline() {
      setStatus({ online: false, lastChangedAt: new Date() })
    }

    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOffline)

    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOffline)
    }
  }, [])

  return status
}
