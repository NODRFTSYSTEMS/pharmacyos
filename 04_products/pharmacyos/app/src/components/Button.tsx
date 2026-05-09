import { forwardRef, type ButtonHTMLAttributes } from 'react'

/**
 * Button — design handoff Section 4.8.
 * Variants: primary | secondary | tertiary | destructive.
 * Sizes:    sm (32px, table inline) | md (40px, default) | lg (48px, form CTA) | xl (56px, POS).
 */

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary text-white border border-transparent hover:bg-primary-hover disabled:bg-border-subtle disabled:text-text-disabled',
  secondary:
    'bg-bg-surface text-text-primary border border-border hover:bg-border-subtle disabled:bg-border-subtle disabled:text-text-disabled',
  tertiary:
    'bg-transparent text-primary border border-transparent hover:text-primary-hover disabled:text-text-disabled',
  destructive:
    'bg-bg-surface text-error border border-error hover:bg-error/5 disabled:bg-border-subtle disabled:text-text-disabled disabled:border-border',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
  xl: 'h-14 px-6 text-base',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', loading = false, fullWidth = false, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium font-sans whitespace-nowrap',
        'rounded-control transition-colors',
        'focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </button>
  )
})
