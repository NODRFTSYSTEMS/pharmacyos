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
    'bg-[--color-primary] text-white border border-transparent hover:bg-[--color-primary-hover] disabled:bg-[--color-border-subtle] disabled:text-[--color-text-disabled]',
  secondary:
    'bg-[--color-bg-surface] text-[--color-text-primary] border border-[--color-border] hover:bg-[--color-border-subtle] disabled:bg-[--color-border-subtle] disabled:text-[--color-text-disabled]',
  tertiary:
    'bg-transparent text-[--color-primary] border border-transparent hover:text-[--color-primary-hover] disabled:text-[--color-text-disabled]',
  destructive:
    'bg-[--color-bg-surface] text-[--color-error] border border-[--color-error] hover:bg-[--color-rx-cancelled-bg] disabled:bg-[--color-border-subtle] disabled:text-[--color-text-disabled] disabled:border-[--color-border]',
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
        'rounded-[--radius-control] transition-colors',
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
