import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.3,
};

/**
 * PageTransition component
 * 
 * Wraps page content with smooth fade and slide animations.
 * Use this component to wrap route components for consistent page transitions.
 * 
 * @example
 * ```tsx
 * export default function MyPage() {
 *   return (
 *     <PageTransition>
 *       <h1>My Page Content</h1>
 *     </PageTransition>
 *   );
 * }
 * ```
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
