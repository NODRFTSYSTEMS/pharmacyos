import { useEffect, useState } from 'react'
import {
  getDemoStaffPortrait,
  getDemoStaffPortraitByName,
  getInitials,
} from '../data/demoStaffPortraits'

interface StaffAvatarProps {
  name?: string | null
  email?: string | null
  role?: string | null
  avatarUrl?: string | null
  avatarAlt?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS: Record<NonNullable<StaffAvatarProps['size']>, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

export function StaffAvatar({
  name,
  email,
  role,
  avatarUrl,
  avatarAlt,
  size = 'md',
  className = '',
}: StaffAvatarProps) {
  const demoPortrait = getDemoStaffPortrait(email) ?? getDemoStaffPortraitByName(name)
  const resolvedUrl = avatarUrl?.trim() || demoPortrait?.url || ''
  const resolvedAlt = avatarAlt?.trim()
    || demoPortrait?.alt
    || (name ? `${name} profile portrait` : 'Staff profile portrait')
  const initials = getInitials(name ?? email)
  const [failed, setFailed] = useState(false)

  // Compose a descriptive tooltip: "Grace Bennett · PHARMACIST" when role is known
  const tooltip = [name ?? email, role].filter(Boolean).join(' · ') || 'Staff member'

  useEffect(() => {
    setFailed(false)
  }, [resolvedUrl])

  const baseClass = `${SIZE_CLASS[size]} rounded-full shrink-0 ring-1 ring-gray-200 bg-gray-100 overflow-hidden ${className}`

  if (!resolvedUrl || failed) {
    return (
      <span
        className={`${baseClass} inline-flex items-center justify-center font-semibold text-gray-600`}
        aria-label={name ? `${name} profile initials` : 'Staff profile initials'}
        title={tooltip}
      >
        {initials}
      </span>
    )
  }

  return (
    <span className={`${baseClass} inline-block`} title={tooltip}>
      <img
        src={resolvedUrl}
        alt={resolvedAlt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
