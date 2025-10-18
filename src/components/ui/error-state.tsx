import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  showAlert?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  showAlert = false,
}: ErrorStateProps) {
  if (showAlert) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              {retryLabel}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-destructive">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
