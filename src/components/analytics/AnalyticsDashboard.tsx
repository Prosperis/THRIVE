import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useInterviewsStore } from '@/stores/interviewsStore';
import {
  calculateAnalytics,
  generateTimeSeriesData,
  calculateStatusDistribution,
  calculateCompanyStats,
  calculateMonthlyTrends,
  formatPercentage,
  formatNumber,
} from '@/lib/analytics';
import { ANALYTICS_PERIODS, type AnalyticsPeriod } from '@/types/analytics';
import { StatCard, MetricGrid } from './StatCard';
import {
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Building2,
  Percent,
} from 'lucide-react';
import { subDays } from 'date-fns';

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod['value']>('30d');
  const { applications } = useApplicationsStore();
  const { interviews } = useInterviewsStore();

  // Calculate period dates
  const period = useMemo(() => {
    const periodConfig = ANALYTICS_PERIODS.find((p) => p.value === selectedPeriod);
    if (!periodConfig || selectedPeriod === 'all' || !periodConfig.days) {
      return undefined;
    }
    return {
      start: subDays(new Date(), periodConfig.days),
      end: new Date(),
    };
  }, [selectedPeriod]);

  // Calculate analytics
  const metrics = useMemo(
    () => calculateAnalytics(applications, interviews, period),
    [applications, interviews, period]
  );

  const timeSeriesData = useMemo(
    () => generateTimeSeriesData(applications, interviews, 30),
    [applications, interviews]
  );

  const statusDistribution = useMemo(
    () => calculateStatusDistribution(applications),
    [applications]
  );

  const companyStats = useMemo(
    () => calculateCompanyStats(applications, interviews),
    [applications, interviews]
  );

  const monthlyTrends = useMemo(
    () => calculateMonthlyTrends(applications, interviews, 6),
    [applications, interviews]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your job search progress and insights
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as AnalyticsPeriod['value'])}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANALYTICS_PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <MetricGrid>
        <StatCard
          title="Total Applications"
          value={formatNumber(metrics.totalApplications)}
          icon={Target}
          description={`${metrics.applicationsThisWeek} this week`}
        />
        <StatCard
          title="Response Rate"
          value={formatPercentage(metrics.responseRate)}
          icon={Percent}
          description={`${metrics.noResponseCount} no response`}
        />
        <StatCard
          title="Interviews"
          value={formatNumber(metrics.totalInterviews)}
          icon={Calendar}
          description={`${metrics.scheduledInterviews} scheduled`}
        />
        <StatCard
          title="Success Rate"
          value={formatPercentage(metrics.offerRate)}
          icon={CheckCircle}
          description={`${metrics.successfulApplications} offers`}
        />
        <StatCard
          title="Avg Response Time"
          value={`${Math.round(metrics.averageResponseTime)}d`}
          icon={Clock}
          description="Days to hear back"
        />
        <StatCard
          title="Interview Conversion"
          value={formatPercentage(metrics.interviewConversionRate)}
          icon={TrendingUp}
          description="Apps → Interviews"
        />
        <StatCard
          title="Offer Conversion"
          value={formatPercentage(metrics.interviewToOfferRate)}
          icon={BarChart3}
          description="Interviews → Offers"
        />
        <StatCard
          title="Active Applications"
          value={formatNumber(metrics.activeApplications)}
          icon={Building2}
          description="In progress"
        />
      </MetricGrid>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="companies">Top Companies</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>

        {/* Timeline Chart */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Activity (Last 30 Days)</CardTitle>
              <CardDescription>
                Track your daily applications, interviews, offers, and rejections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Interviews"
                  />
                  <Line
                    type="monotone"
                    dataKey="offers"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Offers"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejections"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Rejections"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Distribution */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Breakdown by application status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.status}: ${entry.count}`}
                    >
                      {statusDistribution.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Details</CardTitle>
                <CardDescription>Count and percentage by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusDistribution.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm font-medium capitalize">
                          {status.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{status.count}</span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {formatPercentage(status.percentage, 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Stats */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Companies</CardTitle>
              <CardDescription>
                Most applied companies with success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={companyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="companyName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applicationsCount" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="interviewsCount" fill="#8b5cf6" name="Interviews" />
                  <Bar dataKey="offersCount" fill="#10b981" name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Track your progress over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="interviews" fill="#8b5cf6" name="Interviews" />
                  <Bar dataKey="offers" fill="#10b981" name="Offers" />
                  <Bar dataKey="rejections" fill="#ef4444" name="Rejections" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Rate Trend</CardTitle>
              <CardDescription>Monthly response rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Line
                    type="monotone"
                    dataKey="responseRate"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Response Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
