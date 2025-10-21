import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@/components/layout';
import { QueryProvider } from '@/lib/queryClient';
import { autoMigrateOnLoad } from '@/lib/migrate-companies';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance with basepath for GitHub Pages
const router = createRouter({ 
  routeTree,
  basepath: '/thrive'
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Run company data migration on app load
autoMigrateOnLoad();

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
