import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AnimatedStatusBadgeProps {
  status: string;
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  showPulse?: boolean;
}

/**
 * AnimatedStatusBadge - Status badge with smooth color transitions and optional pulse effect
 *
 * Automatically animates when status changes with smooth color transitions.
 * Optional pulse effect for emphasis on status changes.
 *
 * @example
 * ```tsx
 * <AnimatedStatusBadge
 *   status={application.status}
 *   className={statusColors[application.status]}
 * >
 *   {application.status}
 * </AnimatedStatusBadge>
 *
 * <AnimatedStatusBadge
 *   status={application.status}
 *   className={statusColors[application.status]}
 *   showPulse
 * >
 *   {application.status}
 * </AnimatedStatusBadge>
 * ```
 */
export function AnimatedStatusBadge({
  status,
  className,
  children,
  variant = 'default',
  showPulse = false,
}: AnimatedStatusBadgeProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        className="inline-flex"
      >
        <motion.div
          animate={
            showPulse
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          <Badge
            variant={variant}
            className={cn('transition-all duration-300 ease-in-out', className)}
          >
            {children}
          </Badge>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
