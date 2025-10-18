import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { ApplicationFunnelChart } from '@/components/analytics/ApplicationFunnelChart';
import { ApplicationsTimelineChart } from '@/components/analytics/ApplicationsTimelineChart';
import { StatusDistributionChart } from '@/components/analytics/StatusDistributionChart';
import { ResponseMetricsCard } from '@/components/analytics/ResponseMetricsCard';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your job application progress"
      />

      <div className="space-y-6">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Application Funnel Chart */}
          <ApplicationFunnelChart />

          {/* Applications Timeline Chart */}
          <ApplicationsTimelineChart />
        </div>

        {/* Second Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Distribution Chart */}
          <StatusDistributionChart />

          {/* Response Metrics */}
          <ResponseMetricsCard />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with tracking your applications</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              + Add Application
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              📅 Schedule Interview
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              📄 Upload Resume
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              🏢 Add Company
            </Badge>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest application updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet. Start by adding your first application!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
