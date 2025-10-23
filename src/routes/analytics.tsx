import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useInterviewsStore } from '@/stores/interviewsStore';
import { useCompaniesStore } from '@/stores/companiesStore';

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { fetchApplications } = useApplicationsStore();
  const { fetchInterviews } = useInterviewsStore();
  const { fetchCompanies } = useCompaniesStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize data by fetching from database
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchApplications(),
          fetchInterviews(),
          fetchCompanies(),
        ]);
      } catch (error) {
        console.error('Failed to initialize analytics data:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeData();
  }, [fetchApplications, fetchInterviews, fetchCompanies]);

  if (!isInitialized) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <AnalyticsDashboard />
    </div>
  );
}
