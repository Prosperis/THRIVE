import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { isWithinInterval } from 'date-fns';

const STAGE_COLORS: Record<string, string> = {
  applied: '#3b82f6', // blue
  screening: '#8b5cf6', // purple
  interviewing: '#f59e0b', // amber
  offer: '#10b981', // green
  rejected: '#ef4444', // red
  accepted: '#059669', // emerald
  declined: '#6b7280', // gray
  withdrawn: '#64748b', // slate
};

const STAGE_ORDER = [
  'applied',
  'screening',
  'interviewing',
  'offer',
  'accepted',
  'rejected',
  'declined',
  'withdrawn',
];

const STAGE_LABELS: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interviewing: 'Interviewing',
  offer: 'Offer Received',
  accepted: 'Accepted',
  rejected: 'Rejected',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
};

interface TooltipPayload {
  payload: {
    status: string;
    label: string;
    count: number;
    color: string;
    total: number;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = data.total > 0 ? ((data.count / data.total) * 100).toFixed(1) : '0';

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.label}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} application{data.count !== 1 ? 's' : ''} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

interface ApplicationFunnelChartProps {
  period?: {
    start: Date;
    end: Date;
  };
}

export function ApplicationFunnelChart({ period }: ApplicationFunnelChartProps = {}) {
  const { applications } = useApplicationsStore();

  // Filter applications by period if provided
  const filteredApplications = useMemo(() => {
    if (!period) return applications;
    
    return applications.filter((app) => {
      const appDate = new Date(app.appliedDate || app.createdAt);
      return isWithinInterval(appDate, { start: period.start, end: period.end });
    });
  }, [applications, period]);

  const totalApplications = filteredApplications.length;

  const funnelData = useMemo(() => {
    // Count applications by status
    const statusCounts = filteredApplications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Create data in funnel order
    return STAGE_ORDER.map((status) => ({
      status,
      label: STAGE_LABELS[status],
      count: statusCounts[status] || 0,
      color: STAGE_COLORS[status],
      total: totalApplications,
    })).filter((item) => item.count > 0); // Only show stages with data
  }, [filteredApplications, totalApplications]);

  if (filteredApplications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
          <CardDescription>Track your application progress through stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No application data yet. Start adding applications to see your funnel!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
        <CardDescription>
          Progression of {totalApplications} application{totalApplications !== 1 ? 's' : ''} through
          stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={funnelData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="label" type="category" className="text-xs" width={100} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {funnelData.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {funnelData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">
                {item.label} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
