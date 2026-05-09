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
    'bg-[var(--color-primary)] text-white border border-transparent hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-border-subtle)] disabled:text-[var(--color-text-disabled)]',
  secondary:
    'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border-subtle)] disabled:bg-[var(--color-border-subtle)] disabled:text-[var(--color-text-disabled)]',
  tertiary:
    'bg-transparent text-[var(--color-primary)] border border-transparent hover:text-[var(--color-primary-hover)] disabled:text-[var(--color-text-disabled)]',
  destructive:
    'bg-[var(--color-bg-surface)] text-[var(--color-error)] border border-[var(--color-error)] hover:bg-[var(--color-rx-cancelled-bg)] disabled:bg-[var(--color-border-subtle)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border)]',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-4 text-[14px]',
  md: 'h-10 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-6 text-[16px]',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium font-sans whitespace-nowrap',
        'rounded-[var(--radius-control)] transition-colors',
        'focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(15,111,255,0.18)]',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(' ')}
      {...rest}
    />
  )
})
