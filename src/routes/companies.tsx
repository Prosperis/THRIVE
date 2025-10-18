import { createFileRoute } from '@tanstack/react-router';
import { CompanyResearchHub } from '@/components/interview-prep/CompanyResearchHub';

export const Route = createFileRoute('/companies')({
  component: CompaniesRoute,
});

function CompaniesRoute() {
  return (
    <div className="container mx-auto">
      <CompanyResearchHub />
    </div>
  );
}
