import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or
            deleted.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
