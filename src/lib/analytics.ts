import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import type { Application, Interview } from '@/types';
import type {
  AnalyticsMetrics,
  CompanyStats,
  MonthlyTrend,
  ResponseTimeDistribution,
  StatusDistribution,
  TimeSeriesData,
  InterviewStageStats,
} from '@/types/analytics';

/**
 * Calculate comprehensive analytics metrics
 */
export function calculateAnalytics(
  applications: Application[],
  interviews: Interview[],
  period?: { start: Date; end: Date }
): AnalyticsMetrics {
  // Filter by period if specified
  const filteredApps = period
    ? applications.filter((app) => {
        if (!app.appliedDate) return false;
        const date = new Date(app.appliedDate);
        return date >= period.start && date <= period.end;
      })
    : applications;

  const filteredInterviews = period
    ? interviews.filter((interview) => {
        if (!interview.scheduledAt) return false;
        const date = new Date(interview.scheduledAt);
        return date >= period.start && date <= period.end;
      })
    : interviews;

  const totalApplications = filteredApps.length;
  const activeApplications = filteredApps.filter(
    (app) => !['rejected', 'withdrawn', 'accepted'].includes(app.status)
  ).length;
  const rejectedApplications = filteredApps.filter((app) => app.status === 'rejected').length;
  const successfulApplications = filteredApps.filter((app) => app.status === 'accepted').length;

  // Response metrics (considering target and hunting as no response yet)
  const appsWithResponse = filteredApps.filter(
    (app) => app.status !== 'target' && app.status !== 'hunting' && app.status !== 'applied'
  );
  const responseRate =
    totalApplications > 0 ? (appsWithResponse.length / totalApplications) * 100 : 0;
  const noResponseCount = totalApplications - appsWithResponse.length;

  // Calculate average response time
  const responseTimes = appsWithResponse
    .filter((app) => app.appliedDate)
    .map((app) => {
      // Use the earliest status change date or a reasonable estimate
      const appliedDate = new Date(app.appliedDate as Date);
      const now = new Date();
      return differenceInDays(now, appliedDate);
    });
  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

  // Interview metrics
  const totalInterviews = filteredInterviews.length;
  const interviewConversionRate =
    totalApplications > 0 ? (totalInterviews / totalApplications) * 100 : 0;
  const completedInterviews = filteredInterviews.filter(
    (interview) => interview.status === 'completed'
  ).length;
  const scheduledInterviews = filteredInterviews.filter(
    (interview) => interview.status === 'scheduled'
  ).length;

  // Success metrics
  const offerRate = totalApplications > 0 ? (successfulApplications / totalApplications) * 100 : 0;
  const interviewToOfferRate =
    totalInterviews > 0 ? (successfulApplications / totalInterviews) * 100 : 0;

  // Time to interview
  const timeToInterviews = filteredApps
    .filter((app) => {
      if (!app.appliedDate) return false;
      const appInterviews = filteredInterviews.filter((i) => i.applicationId === app.id);
      return appInterviews.length > 0 && appInterviews[0].scheduledAt;
    })
    .map((app) => {
      const appInterviews = filteredInterviews.filter(
        (i) => i.applicationId === app.id && i.scheduledAt
      );
      const firstInterview = appInterviews.sort(
        (a, b) =>
          new Date(a.scheduledAt as Date).getTime() - new Date(b.scheduledAt as Date).getTime()
      )[0];
      return differenceInDays(
        new Date(firstInterview.scheduledAt as Date),
        new Date(app.appliedDate as Date)
      );
    });
  const averageTimeToInterview =
    timeToInterviews.length > 0
      ? timeToInterviews.reduce((sum, time) => sum + time, 0) / timeToInterviews.length
      : 0;

  // Time to offer
  const timeToOffers = filteredApps
    .filter((app) => app.status === 'accepted' && app.appliedDate && app.offerDate)
    .map((app) => {
      return differenceInDays(new Date(app.offerDate as Date), new Date(app.appliedDate as Date));
    });
  const averageTimeToOffer =
    timeToOffers.length > 0
      ? timeToOffers.reduce((sum, time) => sum + time, 0) / timeToOffers.length
      : 0;

  // Activity this week/month
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const applicationsThisWeek = applications.filter(
    (app) => app.appliedDate && new Date(app.appliedDate) >= weekStart
  ).length;
  const applicationsThisMonth = applications.filter(
    (app) => app.appliedDate && new Date(app.appliedDate) >= monthStart
  ).length;
  const interviewsThisWeek = interviews.filter(
    (interview) => interview.scheduledAt && new Date(interview.scheduledAt) >= weekStart
  ).length;
  const interviewsThisMonth = interviews.filter(
    (interview) => interview.scheduledAt && new Date(interview.scheduledAt) >= monthStart
  ).length;

  return {
    totalApplications,
    activeApplications,
    rejectedApplications,
    successfulApplications,
    responseRate,
    averageResponseTime,
    noResponseCount,
    totalInterviews,
    interviewConversionRate,
    completedInterviews,
    scheduledInterviews,
    offerRate,
    interviewToOfferRate,
    averageTimeToInterview,
    averageTimeToOffer,
    applicationsThisWeek,
    applicationsThisMonth,
    interviewsThisWeek,
    interviewsThisMonth,
  };
}

/**
 * Generate time series data for charts
 */
export function generateTimeSeriesData(
  applications: Application[],
  interviews: Interview[],
  days: number = 30,
  period?: { start: Date; end: Date }
): TimeSeriesData[] {
  const endDate = period ? period.end : new Date();
  const startDate = period ? period.start : subDays(endDate, days - 1);

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map((date) => {
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const dayApplications = applications.filter((app) => {
      if (!app.appliedDate) return false;
      const appDate = new Date(app.appliedDate);
      return appDate >= dayStart && appDate < dayEnd;
    });

    const dayInterviews = interviews.filter((interview) => {
      if (!interview.scheduledAt) return false;
      const interviewDate = new Date(interview.scheduledAt);
      return interviewDate >= dayStart && interviewDate < dayEnd;
    });

    const dayOffers = dayApplications.filter(
      (app) => app.status === 'accepted' || app.status === 'offer'
    );

    const dayRejections = dayApplications.filter((app) => app.status === 'rejected');

    return {
      date: format(date, 'MMM dd'),
      applications: dayApplications.length,
      interviews: dayInterviews.length,
      offers: dayOffers.length,
      rejections: dayRejections.length,
    };
  });
}

/**
 * Calculate status distribution
 */
export function calculateStatusDistribution(
  applications: Application[],
  period?: { start: Date; end: Date }
): StatusDistribution[] {
  // Filter by period if specified
  const filteredApps = period
    ? applications.filter((app) => {
        if (!app.appliedDate) return false;
        const date = new Date(app.appliedDate);
        return date >= period.start && date <= period.end;
      })
    : applications;

  const statusColors: Record<string, string> = {
    applied: '#3b82f6',
    'in-review': '#8b5cf6',
    'phone-screen': '#06b6d4',
    'technical-interview': '#10b981',
    'final-interview': '#f59e0b',
    'offer-received': '#22c55e',
    'offer-accepted': '#16a34a',
    'offer-declined': '#6b7280',
    rejected: '#ef4444',
    withdrawn: '#9ca3af',
  };

  const statusCounts = filteredApps.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = filteredApps.length;

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: statusColors[status] || '#6b7280',
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate company statistics
 */
export function calculateCompanyStats(
  applications: Application[],
  interviews: Interview[],
  period?: { start: Date; end: Date }
): CompanyStats[] {
  // Filter by period if specified
  const filteredApps = period
    ? applications.filter((app) => {
        if (!app.appliedDate) return false;
        const date = new Date(app.appliedDate);
        return date >= period.start && date <= period.end;
      })
    : applications;

  const filteredInterviews = period
    ? interviews.filter((interview) => {
        if (!interview.scheduledAt) return false;
        const date = new Date(interview.scheduledAt);
        return date >= period.start && date <= period.end;
      })
    : interviews;

  const companyMap = new Map<string, CompanyStats>();

  for (const app of filteredApps) {
    const companyKey = app.companyName;
    const existing = companyMap.get(companyKey);

    if (existing) {
      existing.applicationsCount++;
      if (app.status === 'accepted' || app.status === 'offer') {
        existing.offersCount++;
      }
    } else {
      companyMap.set(companyKey, {
        companyId: companyKey,
        companyName: app.companyName,
        applicationsCount: 1,
        interviewsCount: 0,
        offersCount: app.status === 'accepted' || app.status === 'offer' ? 1 : 0,
        successRate: 0,
      });
    }
  }

  // Add interview counts
  for (const interview of filteredInterviews) {
    const app = filteredApps.find((a) => a.id === interview.applicationId);
    if (app) {
      const stats = companyMap.get(app.companyName);
      if (stats) {
        stats.interviewsCount++;
      }
    }
  }

  // Calculate success rates
  for (const stats of companyMap.values()) {
    stats.successRate =
      stats.applicationsCount > 0 ? (stats.offersCount / stats.applicationsCount) * 100 : 0;
  }

  return Array.from(companyMap.values())
    .sort((a, b) => b.applicationsCount - a.applicationsCount)
    .slice(0, 10); // Top 10 companies
}

/**
 * Calculate monthly trends
 */
export function calculateMonthlyTrends(
  applications: Application[],
  interviews: Interview[],
  months: number = 6,
  period?: { start: Date; end: Date }
): MonthlyTrend[] {
  const endDate = period ? period.end : new Date();
  const startDate = period
    ? period.start
    : (() => {
        const date = new Date(endDate);
        date.setMonth(date.getMonth() - months + 1);
        date.setDate(1);
        return date;
      })();

  const monthRange = eachMonthOfInterval({ start: startDate, end: endDate });

  return monthRange.map((monthStart) => {
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const monthApps = applications.filter((app) => {
      if (!app.appliedDate) return false;
      const date = new Date(app.appliedDate);
      return date >= monthStart && date < monthEnd;
    });

    const monthInterviews = interviews.filter((interview) => {
      if (!interview.scheduledAt) return false;
      const date = new Date(interview.scheduledAt);
      return date >= monthStart && date < monthEnd;
    });

    const monthOffers = monthApps.filter(
      (app) => app.status === 'accepted' || app.status === 'offer'
    );

    const monthRejections = monthApps.filter((app) => app.status === 'rejected');

    const appsWithResponse = monthApps.filter(
      (app) => app.status !== 'target' && app.status !== 'hunting' && app.status !== 'applied'
    );
    const responseRate =
      monthApps.length > 0 ? (appsWithResponse.length / monthApps.length) * 100 : 0;

    return {
      month: format(monthStart, 'MMM'),
      year: monthStart.getFullYear(),
      applications: monthApps.length,
      interviews: monthInterviews.length,
      offers: monthOffers.length,
      rejections: monthRejections.length,
      responseRate,
    };
  });
}

/**
 * Calculate response time distribution
 */
export function calculateResponseTimeDistribution(
  applications: Application[]
): ResponseTimeDistribution[] {
  const ranges = [
    { label: '0-7 days', min: 0, max: 7 },
    { label: '7-14 days', min: 7, max: 14 },
    { label: '14-30 days', min: 14, max: 30 },
    { label: '30+ days', min: 30, max: Number.POSITIVE_INFINITY },
  ];

  const appsWithResponse = applications.filter(
    (app) =>
      app.status !== 'target' &&
      app.status !== 'hunting' &&
      app.status !== 'applied' &&
      app.appliedDate
  );

  const distribution = ranges.map((range) => {
    const count = appsWithResponse.filter((app) => {
      if (!app.appliedDate) return false;
      const days = differenceInDays(new Date(), new Date(app.appliedDate));
      return days >= range.min && days < range.max;
    }).length;

    return {
      range: range.label,
      count,
      percentage: appsWithResponse.length > 0 ? (count / appsWithResponse.length) * 100 : 0,
    };
  });

  return distribution;
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Get trend direction and color
 */
export function getTrend(
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'neutral'; color: string; percentage: number } {
  if (previous === 0) {
    return { direction: 'neutral', color: 'text-muted-foreground', percentage: 0 };
  }

  const change = ((current - previous) / previous) * 100;

  if (Math.abs(change) < 1) {
    return { direction: 'neutral', color: 'text-muted-foreground', percentage: change };
  }

  return {
    direction: change > 0 ? 'up' : 'down',
    color: change > 0 ? 'text-green-600' : 'text-red-600',
    percentage: change,
  };
}

/**
 * Calculate interview stage statistics
 */
export function calculateInterviewStageStats(
  interviews: Interview[],
  period?: { start: Date; end: Date }
): InterviewStageStats[] {
  // Filter by period if provided
  const filteredInterviews = period
    ? interviews.filter((interview) => {
        if (!interview.scheduledAt) return false;
        const interviewDate = new Date(interview.scheduledAt);
        return (
          interviewDate >= period.start &&
          interviewDate <= period.end
        );
      })
    : interviews;

  // Group interviews by type/stage
  const stageGroups = filteredInterviews.reduce(
    (acc, interview) => {
      const stage = interview.type || 'other';
      if (!acc[stage]) {
        acc[stage] = [];
      }
      acc[stage].push(interview);
      return acc;
    },
    {} as Record<string, Interview[]>
  );

  // Calculate stats for each stage
  return Object.entries(stageGroups).map(([stage, stageInterviews]) => {
    const completedInterviews = stageInterviews.filter((i) => i.status === 'completed');
    const successfulInterviews = stageInterviews.filter(
      (i) => i.status === 'completed' && i.result === 'passed'
    );

    // Calculate average duration (assuming duration field is in minutes)
    let averageDuration = 0;
    if (completedInterviews.length > 0) {
      const totalDuration = completedInterviews.reduce((sum, interview) => {
        // Convert duration from minutes to days (rough estimate: interview happens same day)
        return sum + (interview.duration || 60) / (60 * 24);
      }, 0);
      averageDuration = totalDuration / completedInterviews.length;
    }

    // Calculate success rate
    const successRate =
      completedInterviews.length > 0
        ? (successfulInterviews.length / completedInterviews.length) * 100
        : 0;

    return {
      stage: stage.replace(/-/g, ' '),
      count: stageInterviews.length,
      averageDuration,
      successRate,
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending
}
