/**
 * Eenvoudige card-wrapper met witte achtergrond, afgeronde hoeken,
 * subtiele schaduw en royale padding. Padding-variant configureerbaar.
 */
import type { HTMLAttributes } from 'react';

type Padding = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
}

const paddingClasses: Record<Padding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  padding = 'lg',
  className,
  children,
  ...rest
}: CardProps) {
  const combined = [
    'bg-white rounded-xl shadow-sm',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combined} {...rest}>
      {children}
    </div>
  );
}
