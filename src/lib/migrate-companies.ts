/**
 * Migration Script: CompanyNotes to Companies Store
 *
 * This script migrates company research data from the interviewPrepStore (companyNotes)
 * to the unified companiesStore with the enhanced Company type.
 *
 * Run this once to migrate existing data.
 */

import type { Company } from '@/types';
import type { CompanyPrepNote } from '@/types/interviewPrep';
import { db } from './db';

const MIGRATION_FLAG_KEY = 'thrive_companies_migration_completed';

/**
 * Check if migration has already been completed
 */
export function isMigrationCompleted(): boolean {
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
}

/**
 * Mark migration as completed
 */
function markMigrationCompleted(): void {
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
  console.log('✅ Migration marked as completed');
}

/**
 * Convert CompanyPrepNote to Company type
 */
function convertCompanyNoteToCompany(note: CompanyPrepNote): Company {
  return {
    id: note.id,
    name: note.companyName,
    website: note.companyLinks?.website,
    industry: note.industry,
    size: note.companySize,
    location: undefined, // Not in old schema
    founded: note.founded,
    remotePolicy: note.remotePolicy,

    // Research & Description
    description: undefined, // Not in old schema
    culture: note.cultureNotes,
    cultureNotes: note.cultureNotes,
    techStack: note.techStack,
    benefits: note.benefits,

    // Analysis & Notes
    pros: note.pros,
    cons: note.cons,
    notes: note.notes,
    employeeReviews: note.employeeReviews,
    newsAndUpdates: note.newsAndUpdates,
    competitorComparison: note.competitorComparison,

    // Company Links
    companyLinks: note.companyLinks,

    // Ratings
    ratings: note.ratings,

    // Interview Information
    interviewProcess: note.interviewProcess,
    interviewDifficulty: note.interviewDifficulty,
    interviewExperience: note.interviewExperience,

    // Compensation
    salaryRange: note.salaryRange,

    // Tracking & Status
    status: undefined, // New field, will be auto-assigned based on applications
    priority: undefined, // New field, not in old schema
    researched: note.researched,
    tags: [], // New field, not in old schema

    // Relationships
    applicationIds: note.applicationId ? [note.applicationId] : [],
    contactIds: [],
    documentIds: [],
    interviewIds: note.interviewId ? [note.interviewId] : [],

    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

/**
 * Get company notes from localStorage (interviewPrepStore)
 */
function getCompanyNotesFromLocalStorage(): CompanyPrepNote[] {
  try {
    const interviewPrepData = localStorage.getItem('interview-prep-storage');
    if (!interviewPrepData) {
      console.log('No interview prep data found in localStorage');
      return [];
    }

    const parsed = JSON.parse(interviewPrepData);
    const companyNotes = parsed.state?.companyNotes || [];

    // Convert date strings back to Date objects
    return companyNotes.map(
      (note: CompanyPrepNote & { createdAt: string | Date; updatedAt: string | Date }) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })
    );
  } catch (error) {
    console.error('Error reading company notes from localStorage:', error);
    return [];
  }
}

/**
 * Main migration function
 */
export async function migrateCompanyNotes(): Promise<{
  success: boolean;
  migrated: number;
  skipped: number;
  errors: number;
}> {
  console.log('🔄 Starting company notes migration...');

  if (isMigrationCompleted()) {
    console.log('⚠️ Migration already completed. Skipping.');
    return { success: true, migrated: 0, skipped: 0, errors: 0 };
  }

  const companyNotes = getCompanyNotesFromLocalStorage();
  console.log(`📊 Found ${companyNotes.length} company notes to migrate`);

  if (companyNotes.length === 0) {
    console.log('✅ No data to migrate');
    markMigrationCompleted();
    return { success: true, migrated: 0, skipped: 0, errors: 0 };
  }

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const note of companyNotes) {
    try {
      // Check if company already exists (by name to avoid duplicates)
      const existingCompanies = await db.companies
        .where('name')
        .equalsIgnoreCase(note.companyName)
        .toArray();

      if (existingCompanies.length > 0) {
        console.log(`⏭️ Skipping "${note.companyName}" - already exists`);
        skipped++;
        continue;
      }

      // Convert and add to new store
      const company = convertCompanyNoteToCompany(note);
      await db.companies.add(company);

      console.log(`✅ Migrated: ${company.name}`);
      migrated++;
    } catch (error) {
      console.error(`❌ Error migrating "${note.companyName}":`, error);
      errors++;
    }
  }

  console.log('📈 Migration Summary:');
  console.log(`  ✅ Migrated: ${migrated}`);
  console.log(`  ⏭️ Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);

  if (errors === 0) {
    markMigrationCompleted();
    console.log('🎉 Migration completed successfully!');
  } else {
    console.warn('⚠️ Migration completed with errors. Review logs above.');
  }

  return {
    success: errors === 0,
    migrated,
    skipped,
    errors,
  };
}

/**
 * Force re-run migration (use with caution - may create duplicates)
 */
export function resetMigration(): void {
  localStorage.removeItem(MIGRATION_FLAG_KEY);
  console.log('🔄 Migration flag reset. You can now run migration again.');
}

/**
 * Auto-run migration on app load (if not completed)
 */
export async function autoMigrateOnLoad(): Promise<void> {
  if (isMigrationCompleted()) {
    return;
  }

  console.log('🚀 Auto-running company notes migration...');

  try {
    const result = await migrateCompanyNotes();

    if (result.success) {
      console.log('✅ Auto-migration completed successfully');

      // Show success notification to user
      if (result.migrated > 0) {
        console.info(
          `✨ Migrated ${result.migrated} companies to the new system. ` +
            'You can now manage them from the Companies page!'
        );
      }
    } else {
      console.error('❌ Auto-migration completed with errors');
    }
  } catch (error) {
    console.error('❌ Auto-migration failed:', error);
  }
}

// Export utility to check migration status
export function getMigrationStatus(): {
  completed: boolean;
  hasLegacyData: boolean;
  legacyCount: number;
} {
  const completed = isMigrationCompleted();
  const legacyNotes = getCompanyNotesFromLocalStorage();

  return {
    completed,
    hasLegacyData: legacyNotes.length > 0,
    legacyCount: legacyNotes.length,
  };
}
