import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Bell, BellRinging, Check, Package, Robot, ClockCounterClockwise, Pill, Warning, ArrowBendUpLeft } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Notification {
  id: string
  type: 'low_stock' | 'ai_review_needed' | 'eod_pending' | 'rx_ready' | 'rx_received' | 'system' | 'expiry_alert' | 'void_request' | 'void_decision'
  title: string
  body: string | null
  href: string | null
  is_read: boolean
  created_at: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function typeIcon(type: Notification['type']) {
  switch (type) {
    case 'low_stock':       return <Package size={13} className="text-amber-500 shrink-0" />
    case 'ai_review_needed': return <Robot size={13} className="text-blue-500 shrink-0" />
    case 'eod_pending':     return <ClockCounterClockwise size={13} className="text-yellow-500 shrink-0" />
    case 'rx_ready':
    case 'rx_received':     return <Pill size={13} className="text-purple-500 shrink-0" />
    case 'expiry_alert':   return <Warning size={13} className="text-amber-500 shrink-0" />
    case 'void_request':   return <ArrowBendUpLeft size={13} className="text-red-500 shrink-0" />
    case 'void_decision':  return <Check size={13} className="text-blue-500 shrink-0" />
    default:                return <Bell size={13} className="text-gray-400 shrink-0" />
  }
}

function fmtRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1)  return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  return `${Math.floor(diffH / 24)}d ago`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const ref       = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nav = useNavigate()
  const qc  = useQueryClient()

  // Close on outside click or Escape key (C-03)
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleToggle() {
    if (!open && buttonRef.current) {
      // Calculate dropdown position from the button's viewport coords so the
      // panel escapes the sidebar's overflow-y-auto clipping context.
      const rect = buttonRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, left: Math.max(8, rect.left - 256) })
    }
    setOpen(o => !o)
  }

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Filter out expired notifications server-side by requesting only non-expired ones.
      const { data, error } = await supabase
        .from('notifications')
        .select('id, type, title, body, href, is_read, created_at')
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) return []
      return (data ?? []) as Notification[]
    },
    refetchInterval: 30_000,
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllRead = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read).map(n => n.id)
      if (unread.length === 0) return
      await supabase.from('notifications').update({ is_read: true }).in('id', unread)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  function handleNotificationClick(n: Notification) {
    if (!n.is_read) markRead.mutate(n.id)
    if (n.href) {
      setOpen(false)
      nav(n.href)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="relative p-2 rounded text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {unreadCount > 0
          ? <BellRinging size={16} weight="duotone" className="text-amber-400" />
          : <Bell size={16} weight="duotone" />
        }
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5"
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left }}
          className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden"
          role="menu"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                disabled={markAllRead.isPending}
              >
                <Check size={11} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                    !n.is_read ? 'bg-blue-50/40' : ''
                  }`}
                  role="menuitem"
                >
                  <div className="mt-0.5">{typeIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug ${!n.is_read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">{fmtRelativeTime(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" aria-hidden="true" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
