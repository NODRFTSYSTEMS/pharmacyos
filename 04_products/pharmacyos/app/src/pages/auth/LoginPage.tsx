import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from '@phosphor-icons/react'
import { Button } from '@/components/Button'
import { Input, FormField } from '@/components/Input'
import { Checkbox } from '@/components/Checkbox'

/**
 * Login — design handoff Section 4.13.
 * UI-only at the scaffold milestone; submitting routes to /login/2fa.
 * Real authentication wires up after Supabase login + DB password (G2).
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    // Demo flow — real auth lands when Supabase wires up.
    setTimeout(() => {
      setSubmitting(false)
      navigate('/login/2fa')
    }, 600)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-1">
        <h2 className="type-section text-text-primary">Sign in</h2>
        <p className="text-xs text-text-secondary">Use your pharmacy staff credentials</p>
      </header>

      {error && (
        <div role="alert" className="rounded-control border border-error bg-tag-schedule-bg/60 px-3 py-2 text-xs text-tag-schedule-fg">
          {error}
        </div>
      )}

      <FormField label="Email" required>
        {(p) => (
          <Input
            {...p}
            type="email"
            autoComplete="email"
            placeholder="you@pharmacy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
        )}
      </FormField>

      <FormField label="Password" required>
        {(p) => (
          <Input
            {...p}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
        )}
      </FormField>

      <div className="flex items-center justify-between">
        <Checkbox label="Keep me signed in" disabled={submitting} />
        <a href="#" className="text-xs text-primary hover:text-primary-hover" tabIndex={submitting ? -1 : 0}>
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="flex items-center justify-center gap-1.5 type-label text-text-disabled">
        <ShieldCheck size={12} />
        Two-factor authentication required after sign in
      </p>
    </form>
  )
}

export default LoginPage
