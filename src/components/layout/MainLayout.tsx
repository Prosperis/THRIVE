import type { ReactNode } from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="container py-4 md:py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
