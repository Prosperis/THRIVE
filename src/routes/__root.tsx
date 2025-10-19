import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { GlobalAnnouncer } from '@/components/a11y/LiveRegion';
import { SkipNav } from '@/components/a11y/SkipNav';
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

  return (
    <>
      <SkipNav />
      <GlobalAnnouncer />
      <MainLayout>
        <Outlet />
        <Toaster />
        <CommandPalette />
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </MainLayout>
    </>
  );
}
