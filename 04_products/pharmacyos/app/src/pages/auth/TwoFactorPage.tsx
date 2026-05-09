import { useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'

/**
 * Two-Factor Verification — design handoff Section 4.13.
 * 6-digit boxed input via 6 separate fields. Backspace + paste handling.
 * Backup-code option for users who lost their authenticator app.
 */

const SLOT_COUNT = 6

export function TwoFactorPage() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState<string[]>(Array(SLOT_COUNT).fill(''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  function setDigit(i: number, value: string) {
    setDigits((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  function handleChange(i: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const value = e.target.value.replace(/\D/g, '').slice(-1)
      setDigit(i, value)
      if (value && i < SLOT_COUNT - 1) {
        inputs.current[i + 1]?.focus()
      }
    }
  }

  function handleKeyDown(i: number) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[i] && i > 0) {
        inputs.current[i - 1]?.focus()
      }
      if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus()
      if (e.key === 'ArrowRight' && i < SLOT_COUNT - 1) inputs.current[i + 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, SLOT_COUNT)
    if (!pasted) return
    e.preventDefault()
    const next = pasted.split('').concat(Array(SLOT_COUNT - pasted.length).fill(''))
    setDigits(next)
    inputs.current[Math.min(pasted.length, SLOT_COUNT - 1)]?.focus()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (digits.some((d) => !d)) {
      setError('Enter all 6 digits.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      navigate('/dashboard')
    }, 600)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-1">
        <h2 className="type-section text-text-primary">Two-factor verification</h2>
        <p className="text-xs text-text-secondary">Enter the 6-digit code from your authenticator app</p>
      </header>

      {error && (
        <div role="alert" className="rounded-control border border-error bg-tag-schedule-bg/60 px-3 py-2 text-xs text-tag-schedule-fg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-2" role="group" aria-label="6-digit verification code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            value={d}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={i === 0 ? handlePaste : undefined}
            aria-label={`Digit ${i + 1}`}
            disabled={submitting}
            className="w-12 h-14 type-mono-pos-tender text-center text-text-primary bg-bg-surface border border-border rounded-control focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 disabled:bg-bg-subtle"
          />
        ))}
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
        {submitting ? 'Verifying…' : 'Verify'}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          className="text-primary hover:text-primary-hover disabled:text-text-disabled"
          disabled={submitting}
        >
          Use backup code
        </button>
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary disabled:text-text-disabled"
          onClick={() => navigate('/login')}
          disabled={submitting}
        >
          Back to sign in
        </button>
      </div>
    </form>
  )
}

export default TwoFactorPage
