import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobalAnnouncer } from '@/components/a11y/LiveRegion';
import { SkipNav } from '@/components/a11y/SkipNav';
import { ZustandDevtoolsPanel } from '@/components/devtools/ZustandDevtoolsPanel';
import { CommandPalette } from '@/components/features/command/CommandPalette';
import { MainLayout } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import { useNavigationShortcuts } from '@/hooks/useKeyboardShortcuts';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Enable navigation shortcuts globally
  useNavigationShortcuts();
  const routerState = useRouterState();
  const location = routerState.location.pathname;

  return (
    <>
      <SkipNav />
      <GlobalAnnouncer />
      <MainLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <Toaster />
        <CommandPalette />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ hideUntilHover: true }}
            plugins={[
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Zustand Stores',
                render: <ZustandDevtoolsPanel />,
              },
            ]}
          />
        )}
      </MainLayout>
    </>
  );
}
