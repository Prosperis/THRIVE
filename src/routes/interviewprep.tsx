import { createFileRoute } from '@tanstack/react-router';
import { InterviewPrepPage } from '@/components/interview-prep/InterviewPrepPage';

export const Route = createFileRoute('/interviewprep')({
  component: InterviewPrepRoute,
});

function InterviewPrepRoute() {
  return (
    <div className="container mx-auto">
      <InterviewPrepPage />
    </div>
  );
}
