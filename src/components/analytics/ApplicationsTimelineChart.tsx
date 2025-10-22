import { eachMonthOfInterval, eachWeekOfInterval, format, subMonths } from 'date-fns';
import { useId, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApplicationsStore } from '@/stores/applicationsStore';
import type { Application } from '@/types';

type TimeRange = 'week' | 'month';

interface TooltipPayload {
  payload: {
    period: string;
    applications: number;
    interviews: number;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{data.period}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Applications: {data.applications}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm">Interviews: {data.interviews}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ApplicationsTimelineChart() {
  const { applications } = useApplicationsStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    applications: Application[];
  } | null>(null);
  const gradientId1 = useId();
  const gradientId2 = useId();

  const chartData = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = subMonths(now, 3);

    if (timeRange === 'week') {
      // Group by week
      const weeks = eachWeekOfInterval({ start: threeMonthsAgo, end: now });

      return weeks.map((weekStart) => {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekApplications = applications.filter((app) => {
          if (!app.appliedDate) return false;
          const appDate = new Date(app.appliedDate);
          return appDate >= weekStart && appDate < weekEnd;
        });

        // Count interviews scheduled in this week
        const weekInterviews = weekApplications.filter((app) => {
          return ['screening', 'interviewing'].includes(app.status);
        }).length;

        return {
          period: format(weekStart, 'MMM dd'),
          applications: weekApplications.length,
          interviews: weekInterviews,
          startDate: weekStart,
          endDate: weekEnd,
          applicationList: weekApplications,
        };
      });
    } else {
      // Group by month
      const months = eachMonthOfInterval({ start: threeMonthsAgo, end: now });

      return months.map((monthStart) => {
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const monthApplications = applications.filter((app) => {
          if (!app.appliedDate) return false;
          const appDate = new Date(app.appliedDate);
          return appDate >= monthStart && appDate < monthEnd;
        });

        const monthInterviews = monthApplications.filter((app) => {
          return ['screening', 'interviewing'].includes(app.status);
        }).length;

        return {
          period: format(monthStart, 'MMM yyyy'),
          applications: monthApplications.length,
          interviews: monthInterviews,
          startDate: monthStart,
          endDate: monthEnd,
          applicationList: monthApplications,
        };
      });
    }
  }, [applications, timeRange]);

  const handleChartClick = (data: unknown) => {
    const point = data as { applicationList?: Application[]; period?: string };
    if (point.applicationList && point.applicationList.length > 0) {
      setDrillDownData({
        title: `Applications for ${point.period}`,
        applications: point.applicationList,
      });
    }
  };

  const totalApplications = applications.length;

  if (totalApplications === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Trends</CardTitle>
          <CardDescription>Track your application activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No application data yet. Start adding applications to see trends!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Your application activity over the last 3 months</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              Weekly
            </Button>
            <Button
              size="sm"
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-xs text-muted-foreground">
          💡 Click on any point to view application details
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onClick={handleChartClick}
            style={{ cursor: 'pointer' }}
          >
            <defs>
              <linearGradient id={gradientId1} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={gradientId2} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="period" className="text-xs" tick={{ fontSize: 12 }} />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend wrapperStyle={{ fontSize: '14px' }} iconType="circle" />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId1})`}
              name="Applications"
              activeDot={{ r: 6, style: { cursor: 'pointer' } }}
            />
            <Area
              type="monotone"
              dataKey="interviews"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId2})`}
              name="Interviews"
              activeDot={{ r: 6, style: { cursor: 'pointer' } }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      {/* Drill-Down Dialog */}
      <Dialog open={!!drillDownData} onOpenChange={() => setDrillDownData(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{drillDownData?.title}</DialogTitle>
            <DialogDescription>
              {drillDownData?.applications.length} application
              {drillDownData?.applications.length !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            {drillDownData?.applications.map((app) => (
              <div
                key={app.id}
                className="p-3 border-b last:border-b-0 hover:bg-muted/50 rounded transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{app.companyName}</p>
                    <p className="text-sm text-muted-foreground truncate">{app.position}</p>
                    {app.appliedDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${
                      app.status === 'offer'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : app.status === 'interviewing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          : app.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
