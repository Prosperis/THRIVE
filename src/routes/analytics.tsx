import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout';
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react';

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const metrics = [
    {
      title: 'Application Rate',
      value: '0',
      description: 'Applications per week',
      icon: TrendingUp,
      trend: '+0%',
    },
    {
      title: 'Response Rate',
      value: '0%',
      description: 'Companies responded',
      icon: Activity,
      trend: '+0%',
    },
    {
      title: 'Interview Rate',
      value: '0%',
      description: 'Applications to interviews',
      icon: Target,
      trend: '+0%',
    },
    {
      title: 'Offer Rate',
      value: '0%',
      description: 'Interviews to offers',
      icon: BarChart3,
      trend: '+0%',
    },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your job search performance and insights"
      />

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                    <span className="text-green-500 ml-1">{metric.trend}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Applications submitted over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Chart will appear once you have application data
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>
                Applications by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Chart will appear once you have application data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>
              AI-powered suggestions to improve your job search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Insights will be generated based on your application data.
              Start adding applications to get personalized recommendations!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
