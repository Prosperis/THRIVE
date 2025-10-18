import type { Application } from '@/types';

/**
 * Convert applications to CSV format
 */
export function exportApplicationsToCSV(applications: Application[]): string {
  if (applications.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Company Name',
    'Position',
    'Status',
    'Priority',
    'Target Date',
    'Applied Date',
    'First Interview Date',
    'Offer Date',
    'Response Deadline',
    'Location',
    'Work Type',
    'Employment Type',
    'Salary Min',
    'Salary Max',
    'Job URL',
    'Job Description',
    'Notes',
    'Tags',
    'Source',
    'Referral Name',
    'Created At',
    'Updated At',
  ];

  // Helper to escape CSV values
  const escapeCSVValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    // Escape double quotes and wrap in quotes if contains comma, newline, or quote
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build CSV rows
  const rows = applications.map((app) => [
    escapeCSVValue(app.id),
    escapeCSVValue(app.companyName),
    escapeCSVValue(app.position),
    escapeCSVValue(app.status),
    escapeCSVValue(app.priority || ''),
    escapeCSVValue(app.targetDate || ''),
    escapeCSVValue(app.appliedDate || ''),
    escapeCSVValue(app.firstInterviewDate || ''),
    escapeCSVValue(app.offerDate || ''),
    escapeCSVValue(app.responseDeadline || ''),
    escapeCSVValue(app.location || ''),
    escapeCSVValue(app.workType || ''),
    escapeCSVValue(app.employmentType || ''),
    escapeCSVValue(app.salary?.min || ''),
    escapeCSVValue(app.salary?.max || ''),
    escapeCSVValue(app.jobUrl || ''),
    escapeCSVValue(app.jobDescription || ''),
    escapeCSVValue(app.notes || ''),
    escapeCSVValue(app.tags?.join('; ') || ''),
    escapeCSVValue(app.source || ''),
    escapeCSVValue(app.referralName || ''),
    escapeCSVValue(app.createdAt),
    escapeCSVValue(app.updatedAt),
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Export applications to CSV and trigger download
 */
export function exportAndDownloadApplicationsCSV(applications: Application[]): void {
  const csvContent = exportApplicationsToCSV(applications);

  if (!csvContent) {
    console.warn('No applications to export');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `thrive-applications-${timestamp}.csv`;

  downloadCSV(csvContent, filename);
}

/**
 * Convert data to JSON format for export
 */
export function exportToJSON<T>(data: T, pretty = true): string {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

/**
 * Download JSON file
 */
export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Export applications to JSON and trigger download
 */
export function exportAndDownloadApplicationsJSON(applications: Application[]): void {
  const jsonContent = exportToJSON(applications);

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `thrive-applications-${timestamp}.json`;

  downloadJSON(jsonContent, filename);
}
