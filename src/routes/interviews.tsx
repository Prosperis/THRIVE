import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

export const Route = createFileRoute('/interviews')({
  component: InterviewsPage,
});

function InterviewsPage() {
  return (
    <>
      <PageHeader
        title="Interviews"
        description="Schedule and track your interviews"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>
              Your scheduled interviews and meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-4">
                No interviews scheduled yet.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Your First Interview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Past Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Past Interviews</CardTitle>
            <CardDescription>
              Review your interview history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No past interviews to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
