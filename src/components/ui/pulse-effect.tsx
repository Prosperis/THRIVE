import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PulseEffectProps {
  children: ReactNode;
  trigger?: boolean;
  color?: string;
  duration?: number;
}

/**
 * PulseEffect - Adds a pulse animation to any element
 * 
 * Creates a ripple/pulse effect that emanates from the element.
 * Useful for drawing attention to updates or changes.
 * 
 * @example
 * ```tsx
 * <PulseEffect trigger={statusChanged} color="bg-green-500">
 *   <Badge>New Status</Badge>
 * </PulseEffect>
 * ```
 */
export function PulseEffect({
  children,
  trigger = false,
  color = 'bg-primary',
  duration = 0.6,
}: PulseEffectProps) {
  return (
    <motion.div className="relative inline-flex">
      {trigger && (
        <>
          {/* Outer pulse */}
          <motion.span
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration,
              ease: 'easeOut',
            }}
            className={`absolute inset-0 rounded-full ${color} opacity-30`}
          />
          
          {/* Inner pulse */}
          <motion.span
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: duration * 0.75,
              ease: 'easeOut',
              delay: duration * 0.1,
            }}
            className={`absolute inset-0 rounded-full ${color} opacity-50`}
          />
        </>
      )}
      
      <motion.div
        animate={trigger ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: duration * 0.5,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
