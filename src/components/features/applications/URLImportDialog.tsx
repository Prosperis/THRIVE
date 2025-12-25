import { useState } from 'react';
import { Globe, Loader2, AlertCircle, CheckCircle2, Link } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  fetchJobFromUrl,
  isLikelyJobUrl,
  type ExtractedJobData,
} from '@/lib/url-import';

interface URLImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: ExtractedJobData, selectedFields: Set<string>) => void;
}

export function URLImportDialog({ open, onOpenChange, onImport }: URLImportDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedJobData | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  const handleFetch = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const data = await fetchJobFromUrl(url);
      setExtractedData(data);

      // Auto-select all fields that have data
      const fieldsWithData = new Set<string>();
      if (data.position) fieldsWithData.add('position');
      if (data.companyName) fieldsWithData.add('companyName');
      if (data.location) fieldsWithData.add('location');
      if (data.workType) fieldsWithData.add('workType');
      if (data.employmentType) fieldsWithData.add('employmentType');
      if (data.salaryMin || data.salaryMax) fieldsWithData.add('salary');
      if (data.jobDescription) fieldsWithData.add('jobDescription');
      // Always include the URL
      fieldsWithData.add('jobUrl');
      fieldsWithData.add('source');

      setSelectedFields(fieldsWithData);

      if (!data.position && !data.companyName) {
        toast.warning('Limited data extracted', {
          description: 'Could not extract job details from this page. The URL has been captured.',
        });
      } else {
        toast.success('Job data extracted', {
          description: `Found: ${data.position || 'Unknown position'} at ${data.companyName || 'Unknown company'}`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch job data';
      setError(message);
      toast.error('Import failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (extractedData) {
      onImport(extractedData, selectedFields);
      handleReset();
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setError(null);
    setExtractedData(null);
    setSelectedFields(new Set());
  };

  const toggleField = (field: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(field)) {
      newSelected.delete(field);
    } else {
      newSelected.add(field);
    }
    setSelectedFields(newSelected);
  };

  const fieldConfig = [
    { key: 'position', label: 'Position Title', getValue: (d: ExtractedJobData) => d.position },
    { key: 'companyName', label: 'Company Name', getValue: (d: ExtractedJobData) => d.companyName },
    { key: 'location', label: 'Location', getValue: (d: ExtractedJobData) => d.location },
    {
      key: 'workType',
      label: 'Work Type',
      getValue: (d: ExtractedJobData) =>
        d.workType ? { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }[d.workType] : undefined,
    },
    {
      key: 'employmentType',
      label: 'Employment Type',
      getValue: (d: ExtractedJobData) =>
        d.employmentType
          ? {
              'full-time': 'Full-time',
              'part-time': 'Part-time',
              contract: 'Contract',
              internship: 'Internship',
            }[d.employmentType]
          : undefined,
    },
    {
      key: 'salary',
      label: 'Salary',
      getValue: (d: ExtractedJobData) => {
        if (!d.salaryMin && !d.salaryMax) return undefined;
        const currency = d.salaryCurrency || 'USD';
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
        });
        if (d.salaryMin && d.salaryMax && d.salaryMin !== d.salaryMax) {
          return `${formatter.format(d.salaryMin)} - ${formatter.format(d.salaryMax)}`;
        }
        return formatter.format(d.salaryMin || d.salaryMax || 0);
      },
    },
    { key: 'source', label: 'Source', getValue: (d: ExtractedJobData) => d.source },
    { key: 'jobUrl', label: 'Job URL', getValue: (d: ExtractedJobData) => d.jobUrl },
    {
      key: 'jobDescription',
      label: 'Description',
      getValue: (d: ExtractedJobData) =>
        d.jobDescription ? `${d.jobDescription.slice(0, 150)}...` : undefined,
    },
  ];

  const isJobUrl = url.trim() && isLikelyJobUrl(url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Import from URL
          </DialogTitle>
          <DialogDescription>
            Paste a job posting URL to automatically extract job details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="job-url">Job Posting URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://company.com/jobs/position"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleFetch();
                    }
                  }}
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleFetch} disabled={isLoading || !url.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Fetching
                  </>
                ) : (
                  'Fetch'
                )}
              </Button>
            </div>
            {url.trim() && !isJobUrl && !extractedData && (
              <p className="text-xs text-muted-foreground">
                This URL may not be a job posting. We'll try to extract what we can.
              </p>
            )}
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Extracted Data Preview */}
          {extractedData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Extracted Data</Label>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {selectedFields.size} fields selected
                </Badge>
              </div>

              <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                {fieldConfig.map(({ key, label, getValue }) => {
                  const value = getValue(extractedData);
                  if (!value) return null;

                  return (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleField(key)}
                    >
                      <Checkbox
                        checked={selectedFields.has(key)}
                        onCheckedChange={() => toggleField(key)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground truncate">{value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!extractedData.position && !extractedData.companyName && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Limited extraction</AlertTitle>
                  <AlertDescription>
                    We couldn't extract detailed job information from this page. You can still
                    import the URL and fill in the details manually.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {extractedData && (
            <Button onClick={handleImport} disabled={selectedFields.size === 0}>
              Import Selected Fields
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
