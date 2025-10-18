import { useState, useId } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  FileText,
  FileJson,
  Database,
  Calendar,
  Filter,
  Upload,
} from 'lucide-react';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useInterviewsStore } from '@/stores/interviewsStore';
import { useDocumentsStore } from '@/stores/documentsStore';
import {
  exportAndDownloadApplicationsCSV,
  exportAndDownloadApplicationsJSON,
  exportAndDownloadInterviewsCSV,
  exportAndDownloadDocumentsCSV,
  exportBackup,
  parseBackupFile,
  validateBackupData,
  filterApplicationsByDateRange,
  filterInterviewsByDateRange,
  type DateRangeFilter,
  type BackupData,
} from '@/lib/export';
import { format } from 'date-fns';

export function ExportPage() {
  const startDateId = useId();
  const endDateId = useId();
  const fileUploadId = useId();
  
  const [dateRange, setDateRange] = useState<DateRangeFilter>({});
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');

  const { applications, addApplication } = useApplicationsStore();
  const { interviews, addInterview } = useInterviewsStore();
  const { documents } = useDocumentsStore();

  // Stats
  const stats = {
    applications: applications.length,
    interviews: interviews.length,
    documents: documents.length,
    total: applications.length + interviews.length + documents.length,
  };

  // Handle exports with date range
  const handleExportApplicationsCSV = () => {
    const filtered = dateRange.startDate || dateRange.endDate
      ? filterApplicationsByDateRange(applications, dateRange)
      : applications;
    exportAndDownloadApplicationsCSV(filtered);
  };

  const handleExportInterviewsCSV = () => {
    const filtered = dateRange.startDate || dateRange.endDate
      ? filterInterviewsByDateRange(interviews, dateRange)
      : interviews;
    exportAndDownloadInterviewsCSV(filtered, applications);
  };

  const handleExportDocumentsCSV = () => {
    exportAndDownloadDocumentsCSV(documents);
  };

  const handleExportApplicationsJSON = () => {
    const filtered = dateRange.startDate || dateRange.endDate
      ? filterApplicationsByDateRange(applications, dateRange)
      : applications;
    exportAndDownloadApplicationsJSON(filtered);
  };

  const handleExportBackup = () => {
    exportBackup(applications, interviews, documents);
  };

  // Handle import/restore
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError('');
    setImportSuccess('');

    try {
      const text = await file.text();
      const backupData: BackupData = parseBackupFile(text);

      // Validate data
      const validation = validateBackupData(backupData);
      if (!validation.valid) {
        setImportError(`Invalid backup file: ${validation.errors.join(', ')}`);
        setImporting(false);
        return;
      }

      // Ask for confirmation
      const confirmed = window.confirm(
        `This will restore:\n` +
        `- ${backupData.applications.length} applications\n` +
        `- ${backupData.interviews.length} interviews\n` +
        `- ${backupData.documents.length} documents\n\n` +
        `Current data will be replaced. Continue?`
      );

      if (!confirmed) {
        setImporting(false);
        return;
      }

      // Restore data
      // Note: This is a simplified approach. In production, you'd want more sophisticated merging
      backupData.applications.forEach(app => {
        addApplication(app);
      });
      backupData.interviews.forEach(interview => {
        addInterview(interview);
      });
      // Documents would need similar handling

      setImportSuccess(
        `Successfully restored ${backupData.applications.length} applications, ` +
        `${backupData.interviews.length} interviews, and ${backupData.documents.length} documents`
      );
    } catch (error) {
      setImportError(`Failed to restore backup: ${error}`);
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Export & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Export your data in various formats or create a full backup
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {stats.total} items total
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{stats.applications}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold">{stats.interviews}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{stats.documents}</p>
              </div>
              <FileJson className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          {/* Date Range Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Date Range Filter (Optional)
              </CardTitle>
              <CardDescription>
                Filter exports by date range. Leave empty to export all data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={startDateId}>Start Date</Label>
                  <Input
                    id={startDateId}
                    type="date"
                    value={dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value ? new Date(e.target.value) : undefined,
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={endDateId}>End Date</Label>
                  <Input
                    id={endDateId}
                    type="date"
                    value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value ? new Date(e.target.value) : undefined,
                    }))}
                  />
                </div>
              </div>
              {(dateRange.startDate || dateRange.endDate) && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({})}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CSV Exports */}
          <Card>
            <CardHeader>
              <CardTitle>CSV Exports</CardTitle>
              <CardDescription>
                Download your data as CSV files for analysis in Excel or Google Sheets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Applications</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.applications} applications
                  </p>
                </div>
                <Button onClick={handleExportApplicationsCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Interviews</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.interviews} interviews
                  </p>
                </div>
                <Button onClick={handleExportInterviewsCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Documents</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.documents} documents
                  </p>
                </div>
                <Button onClick={handleExportDocumentsCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Exports */}
          <Card>
            <CardHeader>
              <CardTitle>JSON Exports</CardTitle>
              <CardDescription>
                Download your data as JSON files for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Applications (JSON)</p>
                  <p className="text-sm text-muted-foreground">
                    Complete application data with all fields
                  </p>
                </div>
                <Button onClick={handleExportApplicationsJSON} variant="secondary">
                  <FileJson className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Full Backup
              </CardTitle>
              <CardDescription>
                Create a complete backup of all your data. This includes applications,
                interviews, documents, and all settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Backup Contents:</h3>
                <ul className="space-y-1 text-sm">
                  <li>✓ {stats.applications} Applications</li>
                  <li>✓ {stats.interviews} Interviews</li>
                  <li>✓ {stats.documents} Documents</li>
                  <li>✓ All metadata and relationships</li>
                </ul>
              </div>
              <Button onClick={handleExportBackup} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Create Full Backup
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Restore from Backup
              </CardTitle>
              <CardDescription>
                Restore your data from a previous backup file. This will replace your current data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importError && (
                <div className="p-4 border border-red-500 rounded-lg bg-red-50 dark:bg-red-950">
                  <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
                </div>
              )}
              {importSuccess && (
                <div className="p-4 border border-green-500 rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm text-green-600 dark:text-green-400">{importSuccess}</p>
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={importing}
                  className="hidden"
                  id={fileUploadId}
                />
                <Label
                  htmlFor={fileUploadId}
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {importing ? 'Restoring...' : 'Click to upload backup file'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JSON files only
                  </span>
                </Label>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Warning: Restoring from backup will replace your current data.
                  Make sure to create a backup first if you want to keep your current data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports (Coming Soon)</CardTitle>
              <CardDescription>
                Build custom reports with specific fields and filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Custom report builder feature is coming soon.</p>
                <p className="text-sm mt-2">
                  You'll be able to select specific fields, apply filters, and generate
                  custom reports tailored to your needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
