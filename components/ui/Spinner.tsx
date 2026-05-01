/**
 * Cirkel-spinner in AVD-paars. Gebruikt Tailwind's animate-spin keyframe.
 * `aria-label` configureerbaar voor screenreaders.
 */

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-6 h-6 border-[3px]',
  md: 'w-10 h-10 border-4',
  lg: 'w-14 h-14 border-4',
};

export function Spinner({
  size = 'md',
  label = 'Bezig',
  className = '',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full border-purple-light-bg border-t-purple-primary animate-spin',
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
