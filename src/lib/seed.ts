/**
 * Seed data for testing and development
 */
import { db } from './db';
import { generateId } from './utils';
import type { Application } from '@/types';

export async function seedDatabase() {
  // Check if already seeded
  const existingApplications = await db.applications.count();
  if (existingApplications > 0) {
    console.log('Database already seeded');
    return;
  }

  const sampleApplications: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      companyName: 'TechCorp Inc',
      position: 'Senior Frontend Developer',
      status: 'interviewing',
      priority: 'high',
      workType: 'remote',
      employmentType: 'full-time',
      location: 'San Francisco, CA',
      salary: {
        min: 120000,
        max: 160000,
        currency: 'USD',
      },
      jobUrl: 'https://techcorp.com/jobs/123',
      appliedDate: new Date('2024-01-15'),
      targetDate: new Date('2024-01-10'),
      tags: ['react', 'typescript', 'remote'],
      notes: 'Really excited about this opportunity. Contacted recruiter.',
    },
    {
      companyName: 'StartupXYZ',
      position: 'Full Stack Engineer',
      status: 'applied',
      priority: 'medium',
      workType: 'hybrid',
      employmentType: 'full-time',
      location: 'New York, NY',
      salary: {
        min: 100000,
        max: 140000,
        currency: 'USD',
      },
      appliedDate: new Date('2024-01-20'),
      targetDate: new Date('2024-01-18'),
      tags: ['node', 'react', 'mongodb'],
    },
    {
      companyName: 'BigTech Solutions',
      position: 'React Developer',
      status: 'offer',
      priority: 'high',
      workType: 'onsite',
      employmentType: 'full-time',
      location: 'Seattle, WA',
      salary: {
        min: 150000,
        max: 180000,
        currency: 'USD',
      },
      appliedDate: new Date('2024-01-05'),
      targetDate: new Date('2024-01-01'),
      offerDate: new Date('2024-01-25'),
      responseDeadline: new Date('2024-02-05'),
      tags: ['react', 'redux', 'graphql'],
      notes: 'Received offer! Need to respond by Feb 5th.',
    },
    {
      companyName: 'CloudScale Systems',
      position: 'Software Engineer',
      status: 'hunting',
      priority: 'medium',
      workType: 'remote',
      employmentType: 'full-time',
      location: 'Austin, TX',
      targetDate: new Date('2024-01-22'),
      tags: ['aws', 'microservices'],
      notes: 'Researching company culture and preparing application materials.',
    },
    {
      companyName: 'DataDriven Co',
      position: 'Frontend Architect',
      status: 'rejected',
      priority: 'low',
      workType: 'hybrid',
      employmentType: 'contract',
      location: 'Boston, MA',
      salary: {
        min: 90,
        max: 120,
        currency: 'USD',
      },
      appliedDate: new Date('2024-01-10'),
      targetDate: new Date('2024-01-08'),
      tags: ['angular', 'rxjs'],
    },
    {
      companyName: 'InnovateLabs',
      position: 'UI/UX Engineer',
      status: 'target',
      priority: 'high',
      workType: 'remote',
      employmentType: 'full-time',
      location: 'Remote',
      targetDate: new Date('2024-01-25'),
      tags: ['design-systems', 'react', 'figma'],
      notes: 'Dream company! Planning to apply this week.',
    },
    {
      companyName: 'FinTech Innovators',
      position: 'JavaScript Developer',
      status: 'accepted',
      priority: 'high',
      workType: 'hybrid',
      employmentType: 'full-time',
      location: 'Chicago, IL',
      salary: {
        min: 130000,
        max: 150000,
        currency: 'USD',
      },
      appliedDate: new Date('2023-12-20'),
      offerDate: new Date('2024-01-15'),
      tags: ['typescript', 'vue', 'jest'],
      notes: 'Accepted offer! Start date Feb 15th.',
    },
    {
      companyName: 'Mobile First Inc',
      position: 'React Native Developer',
      status: 'withdrawn',
      priority: 'low',
      workType: 'remote',
      employmentType: 'full-time',
      location: 'Los Angeles, CA',
      appliedDate: new Date('2024-01-08'),
      targetDate: new Date('2024-01-05'),
      tags: ['react-native', 'mobile'],
      notes: 'Withdrew application - accepted another offer.',
    },
  ];

  // Add applications with generated IDs and timestamps
  for (const app of sampleApplications) {
    await db.applications.add({
      ...app,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Application);
  }

  console.log(`✅ Seeded ${sampleApplications.length} sample applications`);
}

// Export a function to clear the database
export async function clearDatabase() {
  await db.applications.clear();
  await db.companies.clear();
  await db.contacts.clear();
  await db.interviews.clear();
  await db.documents.clear();
  console.log('✅ Database cleared');
}
