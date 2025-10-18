import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, MapPin, Video, Phone } from 'lucide-react';
import { InterviewDialog } from '@/components/features/interviews/InterviewDialog';
import { useInterviewsStore } from '@/stores/interviewsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { INTERVIEW_TYPES, INTERVIEW_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';

export const Route = createFileRoute('/interviews')({
  component: InterviewsPage,
});

function InterviewsPage() {
  const { fetchInterviews, getUpcomingInterviews, getPastInterviews } = useInterviewsStore();
  const { applications } = useApplicationsStore();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const upcomingInterviews = getUpcomingInterviews();
  const pastInterviews = getPastInterviews();

  const getApplicationName = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    return app ? `${app.position} at ${app.companyName}` : 'Unknown Application';
  };

  const getInterviewTypeLabel = (type: string) => {
    return INTERVIEW_TYPES.find(t => t.value === type)?.label || type;
  };

  const getInterviewStatusLabel = (status: string) => {
    return INTERVIEW_STATUSES.find(s => s.value === status)?.label || status;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return <Video className="h-4 w-4" />;
    if (type === 'phone-screen') return <Phone className="h-4 w-4" />;
    if (type === 'on-site' || type === 'panel') return <MapPin className="h-4 w-4" />;
    return <CalendarIcon className="h-4 w-4" />;
  };

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
          <InterviewDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            }
          />
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
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-4">
                  No interviews scheduled yet.
                </p>
                <InterviewDialog
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Your First Interview
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        {getTypeIcon(interview.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getApplicationName(interview.applicationId)}</h4>
                          <Badge variant="outline">{getInterviewTypeLabel(interview.type)}</Badge>
                          <Badge variant="secondary">{getInterviewStatusLabel(interview.status)}</Badge>
                        </div>
                        {interview.scheduledAt && (
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(interview.scheduledAt), 'PPp')}
                          </p>
                        )}
                        {interview.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {interview.location}
                          </p>
                        )}
                        {interview.meetingUrl && (
                          <a
                            href={interview.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <Video className="h-3 w-3" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    <InterviewDialog
                      interview={interview}
                      trigger={
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
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
            {pastInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No past interviews to display.
              </p>
            ) : (
              <div className="space-y-4">
                {pastInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        {getTypeIcon(interview.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getApplicationName(interview.applicationId)}</h4>
                          <Badge variant="outline">{getInterviewTypeLabel(interview.type)}</Badge>
                          <Badge variant="secondary">{getInterviewStatusLabel(interview.status)}</Badge>
                        </div>
                        {interview.scheduledAt && (
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(interview.scheduledAt), 'PPp')}
                          </p>
                        )}
                        {interview.feedback && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {interview.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                    <InterviewDialog
                      interview={interview}
                      trigger={
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
