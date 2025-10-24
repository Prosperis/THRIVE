import { useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  // Pages that should fit viewport exactly with minimal vertical padding
  const minimalPaddingRoutes = ['/applications', '/interviews', '/documents'];
  const useMinimalPadding = minimalPaddingRoutes.includes(location.pathname);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className={useMinimalPadding ? 'container py-2' : 'container py-1 md:py-2 lg:py-3'}>
          {children}
        </div>
      </main>
    </div>
  );
}
