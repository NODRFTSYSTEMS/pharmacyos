import { useLocation } from 'react-router-dom'

/**
 * Single placeholder component used by every route during the scaffold phase.
 * Real page components replace this one route at a time during the build phase.
 */
export function Placeholder({ title }: { title: string }) {
  const location = useLocation()
  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-bold text-[--color-text-primary]">{title}</h1>
      <p className="text-sm text-[--color-text-secondary]">
        Route: <code className="font-mono">{location.pathname}</code>
      </p>
      <p className="text-xs text-[--color-text-disabled]">
        Placeholder — real implementation lands during the build phase.
      </p>
    </div>
  )
}
