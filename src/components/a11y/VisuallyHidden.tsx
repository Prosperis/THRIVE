import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Visually Hidden Component
 * Hides content visually but keeps it available to screen readers
 * Use for providing additional context to assistive technologies
 */
export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return <span className={cn('sr-only', className)}>{children}</span>;
}
