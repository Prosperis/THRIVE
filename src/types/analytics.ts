/**
 * Analytics and Metrics Types
 */

export interface AnalyticsMetrics {
  // Overall stats
  totalApplications: number;
  activeApplications: number;
  rejectedApplications: number;
  successfulApplications: number;
  
  // Response metrics
  responseRate: number; // percentage
  averageResponseTime: number; // days
  noResponseCount: number;
  
  // Interview metrics
  totalInterviews: number;
  interviewConversionRate: number; // applications → interviews (percentage)
  completedInterviews: number;
  scheduledInterviews: number;
  
  // Success metrics
  offerRate: number; // applications → offers (percentage)
  interviewToOfferRate: number; // interviews → offers (percentage)
  
  // Time metrics
  averageTimeToInterview: number; // days from application to first interview
  averageTimeToOffer: number; // days from application to offer
  
  // Activity metrics
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  interviewsThisWeek: number;
  interviewsThisMonth: number;
}

export interface TimeSeriesData {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
  rejections: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

export interface CompanyStats {
  companyId: string;
  companyName: string;
  applicationsCount: number;
  interviewsCount: number;
  offersCount: number;
  successRate: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  applications: number;
  interviews: number;
  offers: number;
  rejections: number;
  responseRate: number;
}

export interface ResponseTimeDistribution {
  range: string; // "0-7 days", "7-14 days", etc.
  count: number;
  percentage: number;
}

export interface InterviewStageStats {
  stage: string;
  count: number;
  averageDuration: number; // days in this stage
  successRate: number; // percentage advancing to next stage
}

export interface AnalyticsPeriod {
  label: string;
  value: '7d' | '30d' | '90d' | '1y' | 'all';
  days?: number;
}

export const ANALYTICS_PERIODS: AnalyticsPeriod[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
  { label: 'Last year', value: '1y', days: 365 },
  { label: 'All time', value: 'all' },
];
