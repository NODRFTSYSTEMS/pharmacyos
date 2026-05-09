import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { Check } from '@phosphor-icons/react'

/**
 * Checkbox — controlled binary input with label.
 * Authority: design handoff Section 4.7.
 */
type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className = '', ...rest },
  ref,
) {
  const id = useId()
  return (
    <label htmlFor={id} className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="peer appearance-none w-4 h-4 rounded-[3px] border border-border bg-bg-surface checked:bg-primary checked:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 transition-colors cursor-pointer"
          {...rest}
        />
        <Check
          size={11}
          weight="bold"
          className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          aria-hidden="true"
        />
      </span>
      <span className="type-body-sm text-text-primary">{label}</span>
    </label>
  )
})
