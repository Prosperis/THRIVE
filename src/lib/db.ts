import Dexie, { type EntityTable } from 'dexie';
import type { Application, Interview, Document, Company, Contact } from '@/types';

// Define the database schema
const db = new Dexie('ThriveDB') as Dexie & {
  applications: EntityTable<Application, 'id'>;
  interviews: EntityTable<Interview, 'id'>;
  documents: EntityTable<Document, 'id'>;
  companies: EntityTable<Company, 'id'>;
  contacts: EntityTable<Contact, 'id'>;
};

// Schema version 1
db.version(1).stores({
  applications:
    '++id, companyId, position, status, priority, appliedAt, createdAt, updatedAt',
  interviews: '++id, applicationId, type, scheduledAt, status, createdAt, updatedAt',
  documents: '++id, type, name, version, applicationId, createdAt, updatedAt',
  companies: '++id, name, industry, size, createdAt, updatedAt',
  contacts: '++id, companyId, name, email, role, createdAt, updatedAt',
});

export { db };
