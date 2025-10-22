import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * AnimatedLoader - Smooth loading spinner with optional label
 *
 * Provides a consistent loading indicator with smooth animations.
 *
 * @example
 * ```tsx
 * <AnimatedLoader />
 * <AnimatedLoader size="lg" label="Loading data..." />
 * <AnimatedLoader size="sm" className="text-blue-500" />
 * ```
 */
export function AnimatedLoader({ size = 'md', className, label }: AnimatedLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center gap-3"
    >
      <Loader2
        className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)}
      />
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * AnimatedLoadingDots - Three-dot loading animation
 *
 * Creates a playful three-dot loading indicator.
 *
 * @example
 * ```tsx
 * <AnimatedLoadingDots />
 * <AnimatedLoadingDots className="text-blue-500" />
 * ```
 */
export function AnimatedLoadingDots({ className }: { className?: string }) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: index * 0.15,
            ease: 'easeInOut',
          }}
          className="h-2 w-2 rounded-full bg-current"
        />
      ))}
    </div>
  );
}

/**
 * AnimatedPulse - Pulsing animation for loading states
 *
 * Creates a gentle pulse effect for skeleton loaders or placeholders.
 *
 * @example
 * ```tsx
 * <AnimatedPulse>
 *   <div className="h-20 w-full bg-muted rounded" />
 * </AnimatedPulse>
 * ```
 */
export function AnimatedPulse({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
