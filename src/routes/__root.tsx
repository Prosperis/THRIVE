import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { MainLayout } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import { CommandPalette } from '@/components/features/command/CommandPalette';
import { useNavigationShortcuts } from '@/hooks/useKeyboardShortcuts';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Enable navigation shortcuts globally
  useNavigationShortcuts();

  return (
    <MainLayout>
      <Outlet />
      <Toaster />
      <CommandPalette />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </MainLayout>
  );
}
