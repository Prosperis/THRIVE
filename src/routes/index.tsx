import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader, PageTransition } from '@/components/layout';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <PageTransition>
      <PageHeader
        title="Welcome to THRIVE! 🎯"
        description="Target, Hunt, Reach, Interview, Validate, Employ"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Phase 2 Complete! 🎉</CardTitle>
            <CardDescription>
              Your job application tracking system with routing and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Phase 2 is now complete! We have TanStack Router configured with file-based
              routing and navigation.
            </p>

            {/* Counter Demo */}
            <div className="flex items-center gap-3">
              <Button onClick={() => setCount((count) => count + 1)}>Count: {count}</Button>
              <Button variant="secondary" onClick={() => setCount(0)}>
                Reset
              </Button>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="ghost" size="icon">
                ⚙️
              </Button>
            </div>

            <Separator />

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Phase 0: Complete</Badge>
              <Badge variant="default">Phase 1: Complete</Badge>
              <Badge variant="default">Phase 2: Complete</Badge>
              <Badge variant="secondary">Next: Phase 3</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Feature Showcase */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🗺️ TanStack Router</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type-safe routing with file-based route generation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🧭 Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click links in the header to navigate between pages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔍 Route DevTools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check bottom-right corner for TanStack Router DevTools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Code Splitting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Routes are lazy-loaded for optimal performance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
