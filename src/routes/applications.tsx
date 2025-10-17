import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Track and manage your job applications"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Applications Table Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              All your job applications in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-4">
                No applications yet. Start tracking your job search!
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
