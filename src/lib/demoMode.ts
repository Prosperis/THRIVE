/**
 * Demo Mode utilities for backing up and restoring user data
 * Allows users to toggle demo mode on/off while preserving their real data
 */

import type { Application, Company, Contact, Document, Interview } from '@/types';
import { db } from './db';

export interface UserDataBackup {
  applications: Application[];
  companies: Company[];
  contacts: Contact[];
  interviews: Interview[];
  documents: Document[];
  backedUpAt: Date;
}

const BACKUP_KEY = 'thrive_user_data_backup';

/**
 * Check if there is any user data in the database
 */
export async function hasUserData(): Promise<boolean> {
  const counts = await Promise.all([
    db.applications.count(),
    db.companies.count(),
    db.contacts.count(),
    db.interviews.count(),
    db.documents.count(),
  ]);
  
  return counts.some((count) => count > 0);
}

/**
 * Backup all user data to localStorage before enabling demo mode
 */
export async function backupUserData(): Promise<void> {
  try {
    const backup: UserDataBackup = {
      applications: await db.applications.toArray(),
      companies: await db.companies.toArray(),
      contacts: await db.contacts.toArray(),
      interviews: await db.interviews.toArray(),
      documents: await db.documents.toArray(),
      backedUpAt: new Date(),
    };

    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    console.log('✅ User data backed up successfully');
  } catch (error) {
    console.error('❌ Failed to backup user data:', error);
    throw new Error('Failed to backup user data. Demo mode cannot be enabled.');
  }
}

/**
 * Clear all data from the database (used when enabling demo mode)
 */
export async function clearAllData(): Promise<void> {
  try {
    await db.applications.clear();
    await db.companies.clear();
    await db.contacts.clear();
    await db.interviews.clear();
    await db.documents.clear();
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  }
}

/**
 * Restore user data from backup (used when disabling demo mode)
 */
export async function restoreUserData(): Promise<void> {
  try {
    const backupData = localStorage.getItem(BACKUP_KEY);
    
    if (!backupData) {
      console.log('ℹ️ No backup found, database will remain empty');
      return;
    }

    const backup: UserDataBackup = JSON.parse(backupData);

    // Clear existing data first
    await clearAllData();

    // Restore data
    if (backup.applications.length > 0) {
      await db.applications.bulkAdd(backup.applications);
    }
    if (backup.companies.length > 0) {
      await db.companies.bulkAdd(backup.companies);
    }
    if (backup.contacts.length > 0) {
      await db.contacts.bulkAdd(backup.contacts);
    }
    if (backup.interviews.length > 0) {
      await db.interviews.bulkAdd(backup.interviews);
    }
    if (backup.documents.length > 0) {
      await db.documents.bulkAdd(backup.documents);
    }

    console.log('✅ User data restored successfully');
  } catch (error) {
    console.error('❌ Failed to restore user data:', error);
    throw new Error('Failed to restore user data. Please check your backup.');
  }
}

/**
 * Delete the backup from localStorage (called after successful restore)
 */
export function deleteBackup(): void {
  localStorage.removeItem(BACKUP_KEY);
  console.log('✅ Backup deleted');
}

/**
 * Check if a backup exists
 */
export function hasBackup(): boolean {
  return localStorage.getItem(BACKUP_KEY) !== null;
}

/**
 * Get backup info without loading all data
 */
export function getBackupInfo(): { backedUpAt: Date; itemCount: number } | null {
  try {
    const backupData = localStorage.getItem(BACKUP_KEY);
    if (!backupData) return null;

    const backup: UserDataBackup = JSON.parse(backupData);
    const itemCount =
      backup.applications.length +
      backup.companies.length +
      backup.contacts.length +
      backup.interviews.length +
      backup.documents.length;

    return {
      backedUpAt: new Date(backup.backedUpAt),
      itemCount,
    };
  } catch (error) {
    console.error('Failed to get backup info:', error);
    return null;
  }
}
