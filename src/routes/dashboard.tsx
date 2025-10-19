import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { ApplicationFunnelChart } from '@/components/analytics/ApplicationFunnelChart';
import { ApplicationsTimelineChart } from '@/components/analytics/ApplicationsTimelineChart';
import { ResponseMetricsCard } from '@/components/analytics/ResponseMetricsCard';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { StatusDistributionChart } from '@/components/analytics/StatusDistributionChart';
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer';
import { DashboardWidgetWrapper } from '@/components/dashboard/DashboardWidgetWrapper';
import { ApplicationDialog } from '@/components/features/applications/ApplicationDialog';
import { InterviewDialog } from '@/components/features/interviews/InterviewDialog';
import { PageHeader } from '@/components/layout';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useDashboardStore, type DashboardWidgetType } from '@/stores/dashboardStore';
import { useInterviewsStore } from '@/stores/interviewsStore';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { applications, fetchApplications } = useApplicationsStore();
  const { interviews, fetchInterviews } = useInterviewsStore();

  useEffect(() => {
    fetchApplications();
    fetchInterviews();
  }, [fetchApplications, fetchInterviews]);

  // Get recent activity (last 5 applications/interviews)
  const recentActivity = useMemo(() => {
    const items = [
      ...applications.map((app) => ({
        id: app.id,
        type: 'application' as const,
        title: `Applied to ${app.position}`,
        subtitle: app.companyName,
        status: app.status,
        date: app.appliedDate || app.createdAt,
      })),
      ...interviews.map((interview) => {
        const app = applications.find((a) => a.id === interview.applicationId);
        return {
          id: interview.id,
          type: 'interview' as const,
          title: `Interview scheduled`,
          subtitle: app ? `${app.position} at ${app.companyName}` : 'Unknown',
          status: interview.status,
          date: interview.scheduledAt || interview.createdAt,
        };
      }),
    ];

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [applications, interviews]);

  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (['offer', 'accepted', 'completed'].includes(status)) return 'default';
    if (['rejected', 'cancelled'].includes(status)) return 'destructive';
    return 'secondary';
  };

  const getActivityIcon = (type: 'application' | 'interview') => {
    return type === 'application' ? FileText : Calendar;
  };

  // Dashboard customization
  const { widgets, layoutMode, reorderWidgets } = useDashboardStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);

      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      reorderWidgets(newWidgets);
    }
  };

  const visibleWidgets = useMemo(() => {
    return widgets
      .filter((w) => w.visible)
      .sort((a, b) => a.order - b.order);
  }, [widgets]);

  const renderWidget = (widgetId: DashboardWidgetType) => {
    switch (widgetId) {
      case 'stats':
        return <StatsOverview />;
      
      case 'funnel':
        return <ApplicationFunnelChart />;
      
      case 'timeline':
        return <ApplicationsTimelineChart />;
      
      case 'status-distribution':
        return <StatusDistributionChart />;
      
      case 'response-metrics':
        return <ResponseMetricsCard />;
      
      case 'quick-actions':
        return (
          <AnimatedCard hoverEffect="lift" animateOnMount delay={0.1}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ApplicationDialog
                trigger={
                  <AnimatedButton variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Application
                  </AnimatedButton>
                }
              />

              <InterviewDialog
                trigger={
                  <AnimatedButton variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </AnimatedButton>
                }
              />

              <Link to="/analytics" className="cursor-pointer">
                <AnimatedButton variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </AnimatedButton>
              </Link>

              <Link to="/applications" className="cursor-pointer">
                <AnimatedButton variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Applications
                </AnimatedButton>
              </Link>
            </CardContent>
          </AnimatedCard>
        );
      
      case 'recent-activity':
        return (
          <AnimatedCard hoverEffect="lift" animateOnMount delay={0.2}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No activity yet. Start by adding your first application!
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item) => {
                    const Icon = getActivityIcon(item.type);
                    return (
                      <div key={`${item.type}-${item.id}`} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                              {item.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </AnimatedCard>
        );
      
      default:
        return null;
    }
  };

  const getGridClass = (widgetId: DashboardWidgetType) => {
    // Full width widgets
    if (widgetId === 'stats') return 'col-span-full';
    
    // Half width widgets (2 columns on md+)
    return 'col-span-full md:col-span-1';
  };

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your job application progress"
        action={<DashboardCustomizer />}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {visibleWidgets.map((widget) => (
              <div key={widget.id} className={getGridClass(widget.id)}>
                <DashboardWidgetWrapper id={widget.id} isEditMode={layoutMode === 'edit'}>
                  {renderWidget(widget.id)}
                </DashboardWidgetWrapper>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
