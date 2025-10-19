import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AnimatedBadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  pulse?: boolean;
  animateOnMount?: boolean;
}

/**
 * AnimatedBadge - Generic badge with smooth animations
 *
 * Provides entrance animations and optional pulse effect.
 * Use for any badge that needs animation.
 *
 * @example
 * ```tsx
 * <AnimatedBadge className="bg-green-500">
 *   Active
 * </AnimatedBadge>
 *
 * <AnimatedBadge variant="outline" pulse>
 *   New
 * </AnimatedBadge>
 * ```
 */
export function AnimatedBadge({
  children,
  className,
  variant = 'default',
  pulse = false,
  animateOnMount = true,
}: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={animateOnMount ? { scale: 0.8, opacity: 0 } : undefined}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex"
    >
      <motion.div
        animate={
          pulse
            ? {
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        <Badge variant={variant} className={cn('transition-colors duration-300', className)}>
          {children}
        </Badge>
      </motion.div>
    </motion.div>
  );
}
