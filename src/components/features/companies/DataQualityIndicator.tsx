import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  calculateDataQuality,
  getQualityBadgeColor,
  getQualityBadgeLabel,
} from '@/lib/data-quality';
import type { Company } from '@/types';

interface DataQualityIndicatorProps {
  company: Company;
  variant?: 'inline' | 'detailed';
}

export function DataQualityIndicator({ company, variant = 'inline' }: DataQualityIndicatorProps) {
  const quality = calculateDataQuality(company);

  const getIcon = () => {
    switch (quality.category) {
      case 'excellent':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'good':
        return <Info className="h-4 w-4" />;
      case 'fair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'poor':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (variant === 'inline') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getQualityBadgeColor(quality.category)}`}
          >
            {getIcon()}
            <span>{quality.completeness}%</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Data Quality</h4>
                <Badge variant="outline">{getQualityBadgeLabel(quality.category)}</Badge>
              </div>
              <Progress value={quality.completeness} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{quality.completeness}% complete</p>
            </div>

            {quality.missingFields.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-1">Missing Fields</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {quality.missingFields.map((field, i) => (
                    <li key={i}>• {field}</li>
                  ))}
                </ul>
              </div>
            )}

            {quality.suggestions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-1">Suggestions</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {quality.suggestions.map((suggestion, i) => (
                    <li key={i}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Detailed variant
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold">Data Quality</h3>
        </div>
        <Badge className={getQualityBadgeColor(quality.category)}>
          {getQualityBadgeLabel(quality.category)}
        </Badge>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Completeness</span>
          <span className="font-medium">{quality.completeness}%</span>
        </div>
        <Progress value={quality.completeness} className="h-3" />
      </div>

      {quality.missingFields.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Missing Fields ({quality.missingFields.length})
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 pl-6">
            {quality.missingFields.map((field, i) => (
              <li key={i} className="list-disc">
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}

      {quality.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Suggestions
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 pl-6">
            {quality.suggestions.map((suggestion, i) => (
              <li key={i} className="list-disc">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
