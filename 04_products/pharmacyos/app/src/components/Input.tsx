import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

/**
 * FormField — wraps an input with label, helper text, and error state.
 * Authority: design handoff Section 4.7.
 */

export type FormFieldProps = {
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: (id: string) => ReactNode
  className?: string
}

export function FormField({ label, required, helper, error, children, className = '' }: FormFieldProps) {
  const id = useId()
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="type-label text-text-primary">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children(id)}
      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : helper ? (
        <p className="text-xs text-text-secondary">{helper}</p>
      ) : null}
    </div>
  )
}

/**
 * Input — text/email/password/tel/number/search. Pair with FormField for label + helper.
 * 40px height, --color-bg-surface bg, --color-border, focus ring at primary/20.
 */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  mono?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, mono, className = '', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={[
        'h-10 px-3 type-body-sm text-text-primary',
        'bg-bg-surface border rounded-control transition-shadow',
        'placeholder:text-text-disabled',
        'focus:outline-none focus:ring-[3px] focus:ring-primary/20',
        'disabled:bg-bg-subtle disabled:text-text-disabled disabled:cursor-not-allowed',
        invalid ? 'border-error focus:border-error focus:ring-error/20' : 'border-border focus:border-primary',
        mono ? 'type-mono-input' : '',
        className,
      ].join(' ')}
      {...rest}
    />
  )
})
