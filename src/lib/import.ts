import type { Application, ApplicationStatus } from '@/types';

/**
 * Parse CSV content into rows
 */
export function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }

  // Add last field and row if not empty
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * CSV Import Result
 */
export interface CSVImportResult {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

/**
 * Parse CSV file and return headers and rows
 */
export function parseCSVFile(content: string): CSVImportResult {
  const rows = parseCSV(content);
  
  if (rows.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return {
    headers,
    rows: dataRows,
    totalRows: dataRows.length,
  };
}

/**
 * Field mapping configuration
 */
export interface FieldMapping {
  csvColumn: string; // CSV header name
  appField: keyof Application | null; // Application field to map to
}

/**
 * Validation error
 */
export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

/**
 * Import preview result
 */
export interface ImportPreview {
  valid: Application[];
  invalid: Array<{ row: number; data: Record<string, string>; errors: ValidationError[] }>;
  duplicates: Array<{ row: number; existingId: string; data: Record<string, string> }>;
  totalValid: number;
  totalInvalid: number;
  totalDuplicates: number;
}

/**
 * Validate status value
 */
function isValidStatus(value: string): value is ApplicationStatus {
  const validStatuses: ApplicationStatus[] = [
    'target',
    'hunting',
    'applied',
    'interviewing',
    'offer',
    'accepted',
    'rejected',
    'withdrawn',
  ];
  return validStatuses.includes(value as ApplicationStatus);
}

/**
 * Validate priority value
 */
function isValidPriority(value: string): value is 'low' | 'medium' | 'high' {
  return ['low', 'medium', 'high'].includes(value);
}

/**
 * Convert CSV row to Application object based on field mapping
 */
export function mapRowToApplication(
  row: string[],
  headers: string[],
  mapping: FieldMapping[]
): Partial<Application> {
  const app: Partial<Application> = {};

  headers.forEach((header, index) => {
    const fieldMap = mapping.find((m) => m.csvColumn === header);
    if (!fieldMap || !fieldMap.appField) return;

    const value = row[index];
    if (!value) return;

    const field = fieldMap.appField;

    // Handle specific field types
    switch (field) {
      case 'status':
        if (isValidStatus(value)) {
          app.status = value;
        }
        break;
      case 'priority':
        if (isValidPriority(value)) {
          app.priority = value;
        }
        break;
      case 'targetDate':
      case 'appliedDate':
      case 'firstInterviewDate':
      case 'offerDate':
      case 'responseDeadline':
      case 'createdAt':
      case 'updatedAt':
        try {
          const date = new Date(value);
          if (!Number.isNaN(date.getTime())) {
            app[field] = date;
          }
        } catch {
          // Invalid date, skip
        }
        break;
      case 'tags':
        // Parse semicolon-separated tags
        app.tags = value.split(';').map((t) => t.trim()).filter(Boolean);
        break;
      case 'salary':
        // Skip - handled by salaryMin/salaryMax in validation
        break;
      case 'workType':
        if (['remote', 'hybrid', 'onsite'].includes(value)) {
          app.workType = value as 'remote' | 'hybrid' | 'onsite';
        }
        break;
      case 'employmentType':
        if (['full-time', 'part-time', 'contract', 'internship'].includes(value)) {
          app.employmentType = value as 'full-time' | 'part-time' | 'contract' | 'internship';
        }
        break;
      default:
        // String fields
        (app as Record<string, unknown>)[field] = value;
    }
  });

  // Handle salary range specially
  const salaryMinIndex = headers.findIndex((h) => {
    const map = mapping.find((m) => m.csvColumn === h);
    return map?.appField === 'salary';
  });
  const salaryMaxIndex = headers.findIndex((h, i) => {
    const map = mapping.find((m) => m.csvColumn === h);
    return i > salaryMinIndex && map?.appField === 'salary';
  });

  if (salaryMinIndex !== -1 || salaryMaxIndex !== -1) {
    app.salary = {
      min: salaryMinIndex !== -1 ? parseInt(row[salaryMinIndex]) : undefined,
      max: salaryMaxIndex !== -1 ? parseInt(row[salaryMaxIndex]) : undefined,
      currency: 'USD', // Default currency
    };
  }

  return app;
}

/**
 * Validate a single application
 */
export function validateApplication(
  app: Partial<Application>,
  rowIndex: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!app.companyName) {
    errors.push({
      row: rowIndex,
      field: 'companyName',
      message: 'Company name is required',
    });
  }

  if (!app.position) {
    errors.push({
      row: rowIndex,
      field: 'position',
      message: 'Position is required',
    });
  }

  if (!app.status) {
    errors.push({
      row: rowIndex,
      field: 'status',
      message: 'Status is required',
      value: String(app.status || ''),
    });
  }

  return errors;
}

/**
 * Check if application is a duplicate
 */
export function checkDuplicate(
  app: Partial<Application>,
  existingApps: Application[]
): Application | null {
  // Consider it a duplicate if company name AND position match
  return (
    existingApps.find(
      (existing) =>
        existing.companyName.toLowerCase() === app.companyName?.toLowerCase() &&
        existing.position.toLowerCase() === app.position?.toLowerCase()
    ) || null
  );
}

/**
 * Preview import with validation and duplicate detection
 */
export function previewImport(
  rows: string[][],
  headers: string[],
  mapping: FieldMapping[],
  existingApps: Application[]
): ImportPreview {
  const valid: Application[] = [];
  const invalid: Array<{ row: number; data: Record<string, string>; errors: ValidationError[] }> =
    [];
  const duplicates: Array<{ row: number; existingId: string; data: Record<string, string> }> = [];

  rows.forEach((row, index) => {
    const rowData: Record<string, string> = {};
    headers.forEach((header, i) => {
      rowData[header] = row[i] || '';
    });

    const app = mapRowToApplication(row, headers, mapping);
    const errors = validateApplication(app, index + 2); // +2 for header row and 0-index

    if (errors.length > 0) {
      invalid.push({ row: index + 2, data: rowData, errors });
    } else {
      const duplicate = checkDuplicate(app, existingApps);
      if (duplicate) {
        duplicates.push({ row: index + 2, existingId: duplicate.id, data: rowData });
      } else {
        // Add generated fields
        valid.push({
          ...app,
          id: crypto.randomUUID(),
          createdAt: app.createdAt || new Date(),
          updatedAt: app.updatedAt || new Date(),
        } as Application);
      }
    }
  });

  return {
    valid,
    invalid,
    duplicates,
    totalValid: valid.length,
    totalInvalid: invalid.length,
    totalDuplicates: duplicates.length,
  };
}

/**
 * Auto-detect field mappings based on header names
 */
export function autoDetectMapping(headers: string[]): FieldMapping[] {
  const fieldMap: Record<string, keyof Application> = {
    // Exact matches (lowercase)
    id: 'id',
    position: 'position',
    status: 'status',
    priority: 'priority',
    location: 'location',
    notes: 'notes',
    tags: 'tags',
    source: 'source',

    // Common variations
    'company name': 'companyName',
    company: 'companyName',
    
    'job title': 'position',
    title: 'position',
    role: 'position',

    'target date': 'targetDate',
    targeted: 'targetDate',
    
    'applied date': 'appliedDate',
    'application date': 'appliedDate',
    applied: 'appliedDate',
    
    'interview date': 'firstInterviewDate',
    'first interview': 'firstInterviewDate',
    
    'offer date': 'offerDate',
    offer: 'offerDate',
    
    'response deadline': 'responseDeadline',
    deadline: 'responseDeadline',
    
    'work type': 'workType',
    'remote/hybrid/onsite': 'workType',
    
    'employment type': 'employmentType',
    type: 'employmentType',
    
    'salary min': 'salary',
    'min salary': 'salary',
    'salary minimum': 'salary',
    
    'job url': 'jobUrl',
    url: 'jobUrl',
    link: 'jobUrl',
    
    'job description': 'jobDescription',
    description: 'jobDescription',
    
    'referral name': 'referralName',
    referral: 'referralName',
    
    'created at': 'createdAt',
    created: 'createdAt',
    
    'updated at': 'updatedAt',
    updated: 'updatedAt',
    modified: 'updatedAt',
  };

  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    const appField = fieldMap[normalized] || null;
    
    return {
      csvColumn: header,
      appField,
    };
  });
}
