import { AlertTriangle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import type { Company } from '@/types';
import { findPotentialDuplicates } from '@/lib/data-quality';

interface DuplicateDetectionProps {
  company: Company;
  allCompanies: Company[];
  onViewDuplicate?: (company: Company) => void;
}

export function DuplicateDetection({ company, allCompanies, onViewDuplicate }: DuplicateDetectionProps) {
  const duplicates = findPotentialDuplicates(company, allCompanies);

  if (duplicates.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">
        Potential Duplicate{duplicates.length > 1 ? 's' : ''} Detected
      </AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <p className="mb-3">
          {duplicates.length === 1
            ? 'This company name is similar to another company in your list.'
            : `This company name is similar to ${duplicates.length} other companies in your list.`}
        </p>
        <div className="space-y-2">
          {duplicates.map((duplicate) => (
            <div
              key={duplicate.id}
              className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="font-medium text-sm">{duplicate.name}</div>
                  {duplicate.location && (
                    <div className="text-xs text-muted-foreground">{duplicate.location}</div>
                  )}
                </div>
                {duplicate.status && (
                  <Badge variant="outline" className="text-xs">
                    {duplicate.status}
                  </Badge>
                )}
              </div>
              {onViewDuplicate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDuplicate(duplicate)}
                  className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                >
                  View
                </Button>
              )}
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
