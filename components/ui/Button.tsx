/**
 * AVD-styled button component.
 * Primary: paars met witte tekst. Secondary: outline op witte achtergrond.
 * Sizes: sm, md (default), lg.
 */
import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const baseClasses =
  'inline-flex items-center justify-center font-semibold rounded-xl ' +
  'transition-colors duration-150 focus:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-purple-primary focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-purple-primary text-white hover:bg-purple-dark active:bg-purple-dark',
  secondary:
    'bg-white text-purple-dark border border-purple-primary hover:bg-purple-light-bg',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

function combineClasses(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', className, type = 'button', ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={combineClasses(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      />
    );
  }
);
