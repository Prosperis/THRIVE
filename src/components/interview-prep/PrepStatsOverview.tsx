import { BookOpen, Building2, CheckCircle, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PrepStats } from '@/types/interviewPrep';

interface PrepStatsOverviewProps {
  stats: PrepStats;
}

export function PrepStatsOverview({ stats }: PrepStatsOverviewProps) {
  const completionRate =
    stats.totalQuestions > 0
      ? Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.answeredQuestions} answered ({completionRate}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.practiceSessionsCount}</div>
          <p className="text-xs text-muted-foreground">
            {stats.averageRating > 0
              ? `Avg: ${stats.averageRating.toFixed(1)} / 5.0`
              : 'No ratings yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Companies</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.companiesResearched}</div>
          <p className="text-xs text-muted-foreground">Researched</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Challenges</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.challengesCompleted}</div>
          <p className="text-xs text-muted-foreground">{stats.challengesPending} pending</p>
        </CardContent>
      </Card>
    </div>
  );
}
