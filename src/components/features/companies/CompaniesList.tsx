import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Company } from '@/types';

interface CompaniesListProps {
  companies: Company[];
  onEditCompany?: (company: Company) => void;
  onDeleteCompany?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  target: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'actively-applying': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  applied: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  offer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'not-interested': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const remotePolicyColors: Record<string, string> = {
  office: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  hybrid: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  remote: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
};

export function CompaniesList({ companies, onEditCompany, onDeleteCompany }: CompaniesListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: companies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // Estimated height of each card
    overscan: 5, // Render 5 extra items above and below viewport
  });

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No companies found</p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="overflow-auto" style={{ height: '600px' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const company = companies[virtualRow.index];
          return (
            <div
              key={company.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: '12px', // space-y-3 equivalent
              }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Company Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      {/* Company Name & Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Visit ${company.name} website`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        {/* Location & Industry */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                          {company.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{company.location}</span>
                            </div>
                          )}
                          {company.industry && company.industry.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>{company.industry.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {company.status && (
                            <Badge
                              variant="secondary"
                              className={cn('text-xs', statusColors[company.status])}
                            >
                              {company.status.replace('-', ' ')}
                            </Badge>
                          )}
                          {company.remotePolicy && (
                            <Badge
                              variant="outline"
                              className={cn('text-xs', remotePolicyColors[company.remotePolicy])}
                            >
                              <Globe className="h-3 w-3 mr-1" />
                              {company.remotePolicy}
                            </Badge>
                          )}
                          {company.researched && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Researched
                            </Badge>
                          )}
                          {company.ratings?.overall && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {company.ratings.overall}/5
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {onEditCompany && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCompany(company)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit {company.name}</span>
                          </Button>
                        )}
                        {onDeleteCompany && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteCompany(company.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete {company.name}</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{company.applicationIds?.length || 0} applications</span>
                      </div>
                      {company.notes && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="truncate max-w-md">{company.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
