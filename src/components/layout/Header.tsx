import { Menu } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex md:mr-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">THRIVE</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link
              to="/dashboard"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/applications"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Applications
            </Link>
            <Link
              to="/interviews"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Interviews
            </Link>
            <Link
              to="/documents"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Documents
            </Link>
            <Link
              to="/companies"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Companies
            </Link>
            <Link
              to="/analytics"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Analytics
            </Link>
            <Link
              to="/interviewprep"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Prep
            </Link>
            <Link
              to="/settings"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{
                className:
                  'flex items-center text-sm font-medium text-foreground transition-colors',
              }}
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
