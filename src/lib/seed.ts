/**
 * Seed data for testing and development
 */

import type { Application, Company, Contact, Document, Interview } from '@/types';
import { db } from './db';
import { generateId } from './utils';

export async function seedDatabase() {
  // Check if already seeded
  const existingApplications = await db.applications.count();
  if (existingApplications > 0) {
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
  const applicationIds: Record<string, string> = {};
  for (const app of sampleApplications) {
    const id = generateId();
    applicationIds[app.companyName] = id;
    await db.applications.add({
      ...app,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Application);
  }

  console.log(`✅ Seeded ${sampleApplications.length} sample applications`);

  // Seed Companies
  const sampleCompanies: Array<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      name: 'TechCorp Inc',
      website: 'https://techcorp.com',
      industry: ['Technology', 'Software'],
      size: '1000-5000',
      location: 'San Francisco, CA',
      founded: '2010',
      remotePolicy: 'hybrid',
      description: 'Leading cloud infrastructure provider',
      techStack: ['React', 'TypeScript', 'AWS', 'Kubernetes'],
      researched: true,
      applicationIds: [applicationIds['TechCorp Inc']],
      ratings: {
        overall: 4.2,
        workLifeBalance: 4.0,
        compensation: 4.5,
        careerGrowth: 4.3,
      },
    },
    {
      name: 'StartupXYZ',
      website: 'https://startupxyz.com',
      industry: ['Startup', 'Fintech'],
      size: '50-200',
      location: 'New York, NY',
      founded: '2020',
      remotePolicy: 'hybrid',
      description: 'Innovative fintech startup disrupting payments',
      techStack: ['Node.js', 'React', 'MongoDB', 'GraphQL'],
      researched: true,
      applicationIds: [applicationIds['StartupXYZ']],
      ratings: {
        overall: 3.8,
        workLifeBalance: 3.5,
        compensation: 4.0,
      },
    },
    {
      name: 'BigTech Solutions',
      website: 'https://bigtech.com',
      industry: ['Technology', 'Enterprise Software'],
      size: '10000+',
      location: 'Seattle, WA',
      founded: '1998',
      remotePolicy: 'on-site',
      description: 'Global enterprise software leader',
      techStack: ['React', 'Redux', 'GraphQL', 'Azure'],
      researched: true,
      applicationIds: [applicationIds['BigTech Solutions']],
      ratings: {
        overall: 4.5,
        workLifeBalance: 4.2,
        compensation: 4.8,
        careerGrowth: 4.6,
      },
    },
  ];

  const companyIds: Record<string, string> = {};
  for (const company of sampleCompanies) {
    const id = generateId();
    companyIds[company.name] = id;
    await db.companies.add({
      ...company,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Company);
  }

  console.log(`✅ Seeded ${sampleCompanies.length} sample companies`);

  // Seed Contacts
  const sampleContacts: Array<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      name: 'Sarah Johnson',
      companyId: companyIds['TechCorp Inc'],
      companyName: 'TechCorp Inc',
      title: 'Senior Recruiter',
      email: 'sarah.johnson@techcorp.com',
      linkedIn: 'https://linkedin.com/in/sarahjohnson',
      relationship: 'recruiter',
      notes: 'Very responsive, initial contact via LinkedIn',
    },
    {
      name: 'Michael Chen',
      companyId: companyIds['BigTech Solutions'],
      companyName: 'BigTech Solutions',
      title: 'Engineering Manager',
      email: 'michael.chen@bigtech.com',
      linkedIn: 'https://linkedin.com/in/michaelchen',
      relationship: 'hiring-manager',
      notes: 'Will be conducting technical interview',
    },
    {
      name: 'Emily Rodriguez',
      companyId: companyIds['StartupXYZ'],
      companyName: 'StartupXYZ',
      title: 'Software Engineer',
      email: 'emily@startupxyz.com',
      relationship: 'referral',
      notes: 'Friend from university, provided referral',
    },
  ];

  for (const contact of sampleContacts) {
    await db.contacts.add({
      ...contact,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contact);
  }

  console.log(`✅ Seeded ${sampleContacts.length} sample contacts`);

  // Seed Interviews
  const sampleInterviews: Array<Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      applicationId: applicationIds['TechCorp Inc'],
      round: 1,
      type: 'phone-screen',
      status: 'completed',
      scheduledAt: new Date('2024-01-18'),
      duration: 30,
      interviewers: [
        {
          name: 'Sarah Johnson',
          title: 'Senior Recruiter',
        },
      ],
      result: 'passed',
      feedback: 'Great conversation, moving to technical round',
      followUpSent: true,
    },
    {
      applicationId: applicationIds['TechCorp Inc'],
      round: 2,
      type: 'technical',
      status: 'scheduled',
      scheduledAt: new Date('2024-02-05'),
      duration: 60,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      preparationNotes: 'Review React hooks, system design, and data structures',
      questionsToAsk: [
        'What does the team structure look like?',
        'What are the biggest technical challenges?',
        'How do you handle technical debt?',
      ],
    },
    {
      applicationId: applicationIds['BigTech Solutions'],
      round: 1,
      type: 'video',
      status: 'completed',
      scheduledAt: new Date('2024-01-10'),
      duration: 45,
      interviewers: [
        {
          name: 'Michael Chen',
          title: 'Engineering Manager',
        },
      ],
      result: 'passed',
      feedback: 'Strong technical skills, good culture fit',
      followUpSent: true,
    },
  ];

  for (const interview of sampleInterviews) {
    await db.interviews.add({
      ...interview,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Interview);
  }

  console.log(`✅ Seeded ${sampleInterviews.length} sample interviews`);

  // Seed Documents
  const sampleDocuments: Array<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      name: 'Software Engineer Resume',
      type: 'resume',
      version: 1,
      versionName: 'General Tech',
      content: 'PROFESSIONAL SUMMARY\n\nExperienced software engineer with 5+ years building web applications...',
      tags: ['tech', 'general'],
      notes: 'General purpose resume for tech positions',
    },
    {
      name: 'Frontend Specialist Resume',
      type: 'resume',
      version: 1,
      versionName: 'Frontend Focus',
      content: 'PROFESSIONAL SUMMARY\n\nFrontend specialist with deep expertise in React, TypeScript...',
      tags: ['frontend', 'react'],
      notes: 'Tailored for frontend-focused roles',
      usedInApplicationIds: [applicationIds['TechCorp Inc']],
    },
    {
      name: 'TechCorp Cover Letter',
      type: 'cover-letter',
      version: 1,
      applicationId: applicationIds['TechCorp Inc'],
      content: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Frontend Developer position at TechCorp...',
      tags: ['techcorp'],
      notes: 'Customized for TechCorp position',
      usedInApplicationIds: [applicationIds['TechCorp Inc']],
    },
    {
      name: 'Portfolio Website',
      type: 'portfolio',
      version: 1,
      fileName: 'portfolio.pdf',
      fileUrl: 'https://example.com/portfolio',
      tags: ['portfolio'],
      notes: 'Link to live portfolio website',
    },
  ];

  for (const document of sampleDocuments) {
    await db.documents.add({
      ...document,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Document);
  }

  console.log(`✅ Seeded ${sampleDocuments.length} sample documents`);
  console.log('🎉 Database fully seeded with demo data!');
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
