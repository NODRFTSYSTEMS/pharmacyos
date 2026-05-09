import { useState, type ReactNode } from 'react'

/**
 * Tabs — design handoff Section 4.16.
 * Underline-indicator pattern. Active tab gets primary text + 2px primary
 * bottom border that overlaps the container border.
 */
export type TabDef = {
  value: string
  label: string
  content: ReactNode
}

export function Tabs({
  tabs,
  defaultValue,
  className = '',
}: {
  tabs: readonly TabDef[]
  defaultValue?: string
  className?: string
}) {
  const [active, setActive] = useState(() => defaultValue ?? tabs[0]?.value ?? '')
  const activeTab = tabs.find((t) => t.value === active)
  return (
    <div className={`flex flex-col ${className}`}>
      <div role="tablist" className="flex border-b border-border">
        {tabs.map((t) => {
          const isActive = active === t.value
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.value)}
              className={[
                'h-10 px-4 type-body-sm font-medium transition-colors -mb-px border-b-2',
                isActive
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary',
              ].join(' ')}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {activeTab && (
        <div role="tabpanel" className="flex-1 min-h-0 pt-6">
          {activeTab.content}
        </div>
      )}
    </div>
  )
}
