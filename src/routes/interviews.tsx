import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Bookmark, Calendar as CalendarIcon, List, MapPin, Phone, Plus, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SavedFiltersDialog } from '@/components/features/filters/SavedFiltersDialog';
import { InterviewCalendarView } from '@/components/features/interviews/InterviewCalendarView';
import { InterviewDialog } from '@/components/features/interviews/InterviewDialog';
import { InterviewFilters } from '@/components/features/interviews/InterviewFilters';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '@/lib/constants';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useInterviewsStore } from '@/stores/interviewsStore';
import type { InterviewFilters as InterviewFiltersType } from '@/types';

export const Route = createFileRoute('/interviews')({
  component: InterviewsPage,
});

function InterviewsPage() {
  const { fetchInterviews, getUpcomingInterviews, getPastInterviews, filters, setFilters } =
    useInterviewsStore();
  const { applications } = useApplicationsStore();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const initializeData = async () => {
      await fetchInterviews();
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchInterviews]);

  const upcomingInterviews = getUpcomingInterviews();
  const pastInterviews = getPastInterviews();

  // Filter interviews by search query (application name)
  const filterBySearchQuery = (interviews: typeof upcomingInterviews) => {
    if (!filters.searchQuery?.trim()) return interviews;

    const query = filters.searchQuery.toLowerCase();
    return interviews.filter((interview) => {
      const app = applications.find((a) => a.id === interview.applicationId);
      if (!app) return false;

      const matchesPosition = app.position.toLowerCase().includes(query);
      const matchesCompany = app.companyName.toLowerCase().includes(query);
      return matchesPosition || matchesCompany;
    });
  };

  const filteredUpcoming = filterBySearchQuery(upcomingInterviews);
  const filteredPast = filterBySearchQuery(pastInterviews);

  const getApplicationName = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    return app ? `${app.position} at ${app.companyName}` : 'Unknown Application';
  };

  const getInterviewTypeLabel = (type: string) => {
    return INTERVIEW_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getInterviewStatusLabel = (status: string) => {
    return INTERVIEW_STATUSES.find((s) => s.value === status)?.label || status;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return <Video className="h-4 w-4" />;
    if (type === 'phone-screen') return <Phone className="h-4 w-4" />;
    if (type === 'on-site' || type === 'panel') return <MapPin className="h-4 w-4" />;
    return <CalendarIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Modern Search and Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <SearchInput
            value={filters.searchQuery || ''}
            onChange={(value) => setFilters({ searchQuery: value || undefined })}
            placeholder="Search interviews..."
            className="max-w-sm"
          />
          <InterviewFilters
            savedFiltersButton={
              <SavedFiltersDialog
                filterType="interviews"
                currentFilters={filters}
                onLoadFilter={(loadedFilters) => setFilters(loadedFilters as InterviewFiltersType)}
                trigger={
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Bookmark className="mr-1 h-3 w-3" />
                    Saved
                  </Button>
                }
              />
            }
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex items-center rounded-md border bg-background p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="h-7 px-2"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>

          <InterviewDialog
            trigger={
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            }
          />
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <InterviewCalendarView
          interviews={[...upcomingInterviews, ...pastInterviews]}
          applications={applications}
          onInterviewClick={(interview) => {
            // Could open edit dialog here
            console.log('Clicked interview:', interview);
          }}
        />
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({filteredUpcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({filteredPast.length})</TabsTrigger>
          </TabsList>

          {/* Upcoming Interviews Tab */}
          <TabsContent value="upcoming" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {filteredUpcoming.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground mb-4">
                      {upcomingInterviews.length === 0
                        ? 'No interviews scheduled yet.'
                        : 'No interviews match your filters.'}
                    </p>
                    {upcomingInterviews.length === 0 && (
                      <InterviewDialog
                        trigger={
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Your First Interview
                          </Button>
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUpcoming.map((interview) => (
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
                              <h4 className="font-medium">
                                {getApplicationName(interview.applicationId)}
                              </h4>
                              <Badge variant="outline">
                                {getInterviewTypeLabel(interview.type)}
                              </Badge>
                              <Badge variant="secondary">
                                {getInterviewStatusLabel(interview.status)}
                              </Badge>
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
          </TabsContent>

          {/* Past Interviews Tab */}
          <TabsContent value="past" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {filteredPast.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {pastInterviews.length === 0
                      ? 'No past interviews to display.'
                      : 'No past interviews match your filters.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredPast.map((interview) => (
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
                              <h4 className="font-medium">
                                {getApplicationName(interview.applicationId)}
                              </h4>
                              <Badge variant="outline">
                                {getInterviewTypeLabel(interview.type)}
                              </Badge>
                              <Badge variant="secondary">
                                {getInterviewStatusLabel(interview.status)}
                              </Badge>
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
