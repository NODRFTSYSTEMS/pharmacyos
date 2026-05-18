import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'pharmacyos-theme-mode'

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  return 'light'
}

function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(readStoredTheme)

  useEffect(() => {
    const effective = getEffectiveTheme(theme)
    document.documentElement.dataset.theme = effective
    window.localStorage.setItem(STORAGE_KEY, theme)

    // When system mode: listen for OS preference changes and react immediately
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  function toggleTheme() {
    // Cycle: light → dark → system → light
    setTheme(current => {
      if (current === 'light')  return 'dark'
      if (current === 'dark')   return 'system'
      return 'light'
    })
  }

  // Expose the resolved (effective) theme for icon rendering
  const effectiveTheme: 'light' | 'dark' =
    theme === 'system'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light')
      : theme

  return { theme, effectiveTheme, setTheme, toggleTheme }
}
