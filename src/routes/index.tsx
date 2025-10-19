import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  // Redirect to dashboard on load
  return <Navigate to="/dashboard" />;
}
