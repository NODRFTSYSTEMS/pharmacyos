import { WifiHigh, WifiSlash } from '@phosphor-icons/react'
import { useConnectionStatus } from '../hooks/useConnectionStatus'

interface ConnectionStatusProps {
  compact?: boolean
}

export function ConnectionStatus({ compact = false }: ConnectionStatusProps) {
  const { online, lastChangedAt } = useConnectionStatus()
  const label = online ? 'Online' : 'Offline'
  const title = `${label} since ${lastChangedAt.toLocaleTimeString('en-JM', {
    hour: '2-digit',
    minute: '2-digit',
  })}`

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${
        online
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
      role="status"
      aria-live="polite"
      title={title}
    >
      {online
        ? <WifiHigh size={13} weight="duotone" aria-hidden="true" />
        : <WifiSlash size={13} weight="duotone" aria-hidden="true" />
      }
      {!compact && <span>{label}</span>}
    </div>
  )
}

export function OfflineBanner() {
  const { online } = useConnectionStatus()
  if (online) return null

  return (
    <div
      className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
      aria-live="assertive"
    >
      Internet connection is offline. Existing screen data may remain visible, but new saves,
      AI actions, reports, and synchronization can fail until the connection returns.
    </div>
  )
}
