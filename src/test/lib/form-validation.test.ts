import { describe, it, expect } from 'vitest'

// ── Form validation logic — across auth and admin pages ───────────────────────
// These mirror the validation rules used in:
//   - Users.tsx (EMAIL_RE, line 36)
//   - ResetPassword.tsx (password length, line 59; match check, line 56)
//   - Login.tsx (disabled check: !email || !password, line 128)
//   - LeaveRequests.tsx (date order validation)
//
// Validation bugs silently let bad data reach Supabase or block valid users.

// ── Email validation (Users.tsx EMAIL_RE) ─────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase())
}

describe('Email validation — EMAIL_RE', () => {
  // ── Valid addresses ──────────────────────────────────────────────────────
  it('accepts standard staff email', () => {
    expect(isValidEmail('grace.bennett@winchesterglobal.com')).toBe(true)
  })

  it('accepts admin@nodrftsystems.com', () => {
    expect(isValidEmail('admin@nodrftsystems.com')).toBe(true)
  })

  it('accepts email with plus alias', () => {
    expect(isValidEmail('staff+test@pharmacy.com')).toBe(true)
  })

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.pharmacy.com')).toBe(true)
  })

  it('accepts email with numbers', () => {
    expect(isValidEmail('user123@example.com')).toBe(true)
  })

  it('is case-insensitive (normalised to lowercase before test)', () => {
    expect(isValidEmail('GRACE.BENNETT@WINCHESTERGLOBAL.COM')).toBe(true)
  })

  // ── Invalid addresses ────────────────────────────────────────────────────
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects whitespace-only', () => {
    expect(isValidEmail('   ')).toBe(false)
  })

  it('rejects missing @ symbol', () => {
    expect(isValidEmail('staffexample.com')).toBe(false)
  })

  it('rejects missing domain', () => {
    expect(isValidEmail('staff@')).toBe(false)
  })

  it('rejects missing TLD', () => {
    expect(isValidEmail('staff@example')).toBe(false)
  })

  it('rejects email with spaces', () => {
    expect(isValidEmail('staff @example.com')).toBe(false)
  })

  it('rejects double-@ symbols', () => {
    expect(isValidEmail('staff@@example.com')).toBe(false)
  })

  it('rejects plain text', () => {
    expect(isValidEmail('not an email')).toBe(false)
  })
})

// ── Password validation (ResetPassword.tsx) ───────────────────────────────────

function isValidPasswordLength(password: string): boolean {
  return password.length >= 8
}

function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm
}

describe('Password length validation — minimum 8 characters', () => {
  it('accepts 8-character password', () => {
    expect(isValidPasswordLength('abcdefgh')).toBe(true)
  })

  it('accepts password longer than 8 characters', () => {
    expect(isValidPasswordLength('SuperSecure123!')).toBe(true)
  })

  it('rejects 7-character password', () => {
    expect(isValidPasswordLength('abcdefg')).toBe(false)
  })

  it('rejects empty password', () => {
    expect(isValidPasswordLength('')).toBe(false)
  })

  it('rejects single-character password', () => {
    expect(isValidPasswordLength('a')).toBe(false)
  })

  it('counts spaces as characters (spaces are valid in passwords)', () => {
    // 8 spaces is technically 8 chars — UI may warn but validation passes
    expect(isValidPasswordLength('        ')).toBe(true)
  })
})

describe('Password match validation — confirm field', () => {
  it('returns true when passwords match', () => {
    expect(passwordsMatch('SecurePass1!', 'SecurePass1!')).toBe(true)
  })

  it('returns false when passwords differ by one character', () => {
    expect(passwordsMatch('SecurePass1!', 'SecurePass1')).toBe(false)
  })

  it('is case-sensitive', () => {
    expect(passwordsMatch('password', 'Password')).toBe(false)
  })

  it('returns false when confirm is empty', () => {
    expect(passwordsMatch('SecurePass1!', '')).toBe(false)
  })

  it('returns true for two empty strings (both empty — length guard catches this first)', () => {
    expect(passwordsMatch('', '')).toBe(true)
  })
})

// ── Login submit guard (Login.tsx) ────────────────────────────────────────────
// disabled={loading || !email || !password}

function loginCanSubmit(email: string, password: string, loading: boolean): boolean {
  return !loading && Boolean(email) && Boolean(password)
}

describe('Login submit guard', () => {
  it('allows submit when email and password are set and not loading', () => {
    expect(loginCanSubmit('staff@pharmacy.com', 'password123', false)).toBe(true)
  })

  it('blocks submit when loading', () => {
    expect(loginCanSubmit('staff@pharmacy.com', 'password123', true)).toBe(false)
  })

  it('blocks submit when email is empty', () => {
    expect(loginCanSubmit('', 'password123', false)).toBe(false)
  })

  it('blocks submit when password is empty', () => {
    expect(loginCanSubmit('staff@pharmacy.com', '', false)).toBe(false)
  })

  it('blocks submit when both are empty', () => {
    expect(loginCanSubmit('', '', false)).toBe(false)
  })

  it('blocks submit when both empty and loading', () => {
    expect(loginCanSubmit('', '', true)).toBe(false)
  })
})

// ── Full name validation (Users.tsx) ──────────────────────────────────────────

function isValidFullName(name: string): boolean {
  return name.trim().length > 0
}

describe('Full name validation — required field', () => {
  it('accepts a normal staff name', () => {
    expect(isValidFullName('Grace Bennett')).toBe(true)
  })

  it('accepts single word name', () => {
    expect(isValidFullName('Admin')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidFullName('')).toBe(false)
  })

  it('rejects whitespace-only (trims before checking)', () => {
    expect(isValidFullName('   ')).toBe(false)
  })
})

// ── Date order validation (leave requests) ────────────────────────────────────

function isValidDateRange(startDate: string, endDate: string): boolean {
  return new Date(endDate).getTime() >= new Date(startDate).getTime()
}

describe('Date range validation — leave requests', () => {
  it('accepts start date before end date', () => {
    expect(isValidDateRange('2026-05-18', '2026-05-22')).toBe(true)
  })

  it('accepts same start and end date (single day)', () => {
    expect(isValidDateRange('2026-05-18', '2026-05-18')).toBe(true)
  })

  it('rejects end date before start date', () => {
    expect(isValidDateRange('2026-05-22', '2026-05-18')).toBe(false)
  })

  it('accepts dates spanning a month boundary', () => {
    expect(isValidDateRange('2026-05-28', '2026-06-03')).toBe(true)
  })
})
