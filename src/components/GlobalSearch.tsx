import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { MagnifyingGlass, X, Pill, User, Package, Receipt, Users, Storefront } from '@phosphor-icons/react'
import { useGlobalSearch, type SearchResult } from '../hooks/useGlobalSearch'

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  patient:      'Patients',
  prescription: 'Prescriptions',
  product:      'Products',
  transaction:  'Transactions',
  staff:        'Staff',
  supplier:     'Suppliers',
}

const TYPE_ORDER: SearchResult['type'][] = [
  'patient', 'prescription', 'product', 'transaction', 'staff', 'supplier',
]

function ResultIcon({ type }: { type: SearchResult['type'] }) {
  const cls = 'shrink-0 text-gray-400'
  switch (type) {
    case 'patient':      return <User       size={16} weight="duotone" className={cls} />
    case 'prescription': return <Pill       size={16} weight="duotone" className={cls} />
    case 'product':      return <Package    size={16} weight="duotone" className={cls} />
    case 'transaction':  return <Receipt    size={16} weight="duotone" className={cls} />
    case 'staff':        return <Users      size={16} weight="duotone" className={cls} />
    case 'supplier':     return <Storefront size={16} weight="duotone" className={cls} />
  }
}

interface GroupedResults {
  type: SearchResult['type']
  items: SearchResult[]
}

function groupResults(results: SearchResult[]): GroupedResults[] {
  const map = new Map<SearchResult['type'], SearchResult[]>()
  for (const result of results) {
    const existing = map.get(result.type)
    if (existing) {
      existing.push(result)
    } else {
      map.set(result.type, [result])
    }
  }
  return TYPE_ORDER.flatMap(type => {
    const items = map.get(type)
    return items && items.length > 0 ? [{ type, items }] : []
  })
}

function buildFlatList(groups: GroupedResults[]): SearchResult[] {
  return groups.flatMap(g => g.items)
}

// Detect Mac so we can show ⌘K vs Ctrl+K in the footer hint
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
const shortcutHint = isMac ? '⌘K' : 'Ctrl+K'

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef    = useRef<HTMLInputElement>(null)
  const panelRef    = useRef<HTMLDivElement>(null)
  const navigate    = useNavigate()

  const { data: results = [], isFetching } = useGlobalSearch(query)
  const groups   = groupResults(results)
  const flatList = buildFlatList(groups)

  // Reset state when overlay opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      const id = setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      return () => clearTimeout(id)
    }
  }, [open])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [results])

  const handleSelect = useCallback(
    (href: string) => {
      navigate(href)
      onClose()
    },
    [navigate, onClose],
  )

  // Keyboard navigation with focus trap
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap: keep Tab within the modal panel
      if (e.key === 'Tab') {
        e.preventDefault()
        const panel = panelRef.current
        if (!panel) return
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')
        )
        if (focusable.length === 0) return
        const current = focusable.indexOf(document.activeElement as HTMLElement)
        const next = e.shiftKey
          ? (current - 1 + focusable.length) % focusable.length
          : (current + 1) % focusable.length
        focusable[next]?.focus()
        return
      }

      if (flatList.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => (i + 1) % flatList.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => (i - 1 + flatList.length) % flatList.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const active = flatList[activeIndex]
        if (active) handleSelect(active.href)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, flatList, activeIndex, handleSelect, onClose])

  if (!open) return null

  const showEmpty  = query.length >= 2 && !isFetching && results.length === 0
  const showPrompt = query.length < 2
  const activeId   = flatList[activeIndex] ? `search-result-${flatList[activeIndex].id}` : undefined

  const liveMessage = isFetching && query.length >= 2
    ? 'Searching…'
    : showEmpty
      ? `No results for ${query}`
      : ''

  const overlay = (
    <div
      className="fixed inset-0 bg-black/40 z-[100] flex items-start justify-center pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Dialog panel — role="dialog" belongs here, not on the backdrop */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
      >
        {/* Live region announces status changes to screen readers */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </div>

        {/* Search input row */}
        <div className="flex items-center gap-2 px-3 border-b border-gray-200">
          <MagnifyingGlass size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
            aria-controls="search-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients, prescriptions, products…"
            className="w-full px-1 py-3 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            aria-label="Search"
          />
          {query.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 text-gray-400 hover:text-gray-600 p-0.5 rounded"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results area */}
        <div id="search-listbox" className="max-h-96 overflow-y-auto" role="listbox" aria-label="Search results">
          {showPrompt && (
            <p className="px-4 py-8 text-sm text-gray-500 text-center">
              Type to search…
            </p>
          )}

          {isFetching && query.length >= 2 && (
            <p className="px-4 py-8 text-sm text-gray-500 text-center" aria-hidden="true">
              Searching…
            </p>
          )}

          {showEmpty && (
            <p className="px-4 py-8 text-sm text-gray-500 text-center" aria-hidden="true">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!isFetching && (() => {
            const groupsWithOffset: Array<{ group: GroupedResults; startIndex: number }> = []
            let offset = 0
            for (const group of groups) {
              groupsWithOffset.push({ group, startIndex: offset })
              offset += group.items.length
            }
            return groupsWithOffset.map(({ group, startIndex }) => (
              <div key={group.type}>
                <div className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                  {TYPE_LABELS[group.type]}
                </div>
                {group.items.map((result, i) => {
                  const itemIndex = startIndex + i
                  const isActive  = itemIndex === activeIndex
                  return (
                    <div
                      key={result.id}
                      id={`search-result-${result.id}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(itemIndex)}
                      onClick={() => handleSelect(result.href)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer ${
                        isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <ResultIcon type={result.type} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))
          })()}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 flex gap-4 items-center">
          <span>&#8629; select</span>
          <span>&#8593;&#8595; navigate</span>
          <span>Esc close</span>
          <span className="ml-auto">{shortcutHint} to reopen</span>
        </div>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
