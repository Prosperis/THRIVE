import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <AnalyticsDashboard />
    </div>
  );
}
