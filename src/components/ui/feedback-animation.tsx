import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const bgMap = {
  success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
  error: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
  warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
  info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
};

/**
 * FeedbackAnimation - Animated feedback messages with icons
 *
 * Shows success, error, warning, or info messages with smooth animations.
 *
 * @example
 * ```tsx
 * <FeedbackAnimation
 *   type="success"
 *   message="Saved successfully!"
 *   description="Your changes have been saved."
 * />
 * ```
 */
export function FeedbackAnimation({
  type,
  message,
  description,
  className,
  onClose,
}: FeedbackAnimationProps) {
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={cn('flex items-start gap-3 p-4 rounded-lg border', bgMap[type], className)}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.1,
          type: 'spring',
          stiffness: 500,
          damping: 20,
        }}
      >
        <Icon className={cn('h-5 w-5', colorMap[type])} />
      </motion.div>

      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className={cn('font-medium text-sm', colorMap[type])}
        >
          {message}
        </motion.p>

        {description && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>

      {onClose && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={cn('text-sm hover:opacity-70 transition-opacity', colorMap[type])}
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  );
}
