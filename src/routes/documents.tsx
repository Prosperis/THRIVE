import { createFileRoute } from '@tanstack/react-router';
import { ResumierMicrofrontend } from '@/components/features/documents/ResumierMicrofrontend';

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
});

function DocumentsPage() {
  return <ResumierMicrofrontend />;
}
