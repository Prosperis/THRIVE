import { StatCard } from './StatCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  FileText, 
  Calendar, 
  Users, 
  Building2, 
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function StatsOverview() {
  const analytics = useAnalytics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Applications */}
      <StatCard
        title="Total Applications"
        value={analytics.totals.applications}
        description={`${analytics.thisWeek.applications} this week`}
        icon={FileText}
        trend={
          analytics.thisWeek.applications > 0
            ? {
                value: analytics.thisWeek.applications,
                label: 'vs last week',
                direction: 'up',
              }
            : undefined
        }
      />

      {/* Total Interviews */}
      <StatCard
        title="Interviews"
        value={analytics.totals.interviews}
        description={`${analytics.breakdown.upcomingInterviews} upcoming`}
        icon={Calendar}
        trend={
          analytics.thisWeek.interviews > 0
            ? {
                value: analytics.thisWeek.interviews,
                label: 'this week',
                direction: 'up',
              }
            : undefined
        }
      />

      {/* Active Applications */}
      <StatCard
        title="Active Applications"
        value={analytics.breakdown.active}
        description="In progress"
        icon={Target}
      />

      {/* Response Rate */}
      <StatCard
        title="Response Rate"
        value={`${analytics.metrics.responseRate}%`}
        description="Applications to interviews"
        icon={TrendingUp}
        trend={
          analytics.metrics.responseRate > 0
            ? {
                value: analytics.metrics.responseRate,
                label: 'conversion rate',
                direction: analytics.metrics.responseRate > 30 ? 'up' : 'neutral',
              }
            : undefined
        }
      />

      {/* Offers Received */}
      <StatCard
        title="Offers"
        value={analytics.breakdown.offers}
        description="Job offers received"
        icon={CheckCircle}
      />

      {/* Rejections */}
      <StatCard
        title="Rejections"
        value={analytics.breakdown.rejections}
        description="Keep applying!"
        icon={XCircle}
      />

      {/* Contacts */}
      <StatCard
        title="Contacts"
        value={analytics.totals.contacts}
        description="Professional network"
        icon={Users}
      />

      {/* Companies */}
      <StatCard
        title="Companies"
        value={analytics.totals.companies}
        description="Companies tracked"
        icon={Building2}
      />
    </div>
  );
}
