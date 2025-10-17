import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout';
import { Briefcase, Calendar, CheckCircle2, Clock, FileText, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const stats = [
    {
      title: 'Total Applications',
      value: '0',
      description: 'Applications submitted',
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      title: 'Active Applications',
      value: '0',
      description: 'In progress',
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      title: 'Interviews Scheduled',
      value: '0',
      description: 'Upcoming interviews',
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      title: 'Offers Received',
      value: '0',
      description: 'Job offers',
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Documents',
      value: '0',
      description: 'Resumes & CVs',
      icon: FileText,
      color: 'text-indigo-500',
    },
    {
      title: 'Success Rate',
      value: '0%',
      description: 'Response rate',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your job application progress"
      />

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
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
