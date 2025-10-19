import type { Application } from '@/types';
import { downloadJSON, exportToJSON } from './export';

/**
 * Create a backup of applications with metadata
 */
export interface BackupData {
  version: string;
  timestamp: Date;
  recordCount: number;
  applications: Application[];
}

/**
 * Create a complete backup with metadata
 */
export function createBackup(applications: Application[]): BackupData {
  return {
    version: '1.0.0',
    timestamp: new Date(),
    recordCount: applications.length,
    applications,
  };
}

/**
 * Export backup to JSON file
 */
export function exportBackup(applications: Application[]): { filename: string; size: number } {
  const backup = createBackup(applications);
  const jsonContent = exportToJSON(backup);
  const size = new Blob([jsonContent]).size;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = `thrive-backup-${timestamp}.json`;

  downloadJSON(jsonContent, filename);

  return { filename, size };
}

/**
 * Calculate size of backup data in bytes
 */
export function calculateBackupSize(applications: Application[]): number {
  const backup = createBackup(applications);
  const jsonContent = exportToJSON(backup);
  return new Blob([jsonContent]).size;
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Parse backup file and validate
 */
export function parseBackupFile(content: string): {
  valid: boolean;
  data?: BackupData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(content);

    // Check if it has backup metadata
    if (parsed.version && parsed.timestamp && parsed.applications) {
      return {
        valid: true,
        data: {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        },
      };
    }

    // Fallback: treat as direct application array
    if (Array.isArray(parsed)) {
      return {
        valid: true,
        data: {
          version: '1.0.0',
          timestamp: new Date(),
          recordCount: parsed.length,
          applications: parsed,
        },
      };
    }

    return {
      valid: false,
      error: 'Invalid backup format',
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to parse backup file',
    };
  }
}
