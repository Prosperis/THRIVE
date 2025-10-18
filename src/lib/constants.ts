/**
 * Application constants and configuration
 */

import type { ApplicationStatus } from '@/types';

/**
 * Application status configuration
 */
export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: 'target',
    label: 'Target',
    description: 'Companies/positions identified as potential opportunities',
    color: 'gray',
  },
  {
    value: 'hunting',
    label: 'Hunting',
    description: 'Actively researching and preparing application materials',
    color: 'blue',
  },
  {
    value: 'applied',
    label: 'Applied',
    description: 'Application submitted, awaiting response',
    color: 'yellow',
  },
  {
    value: 'interviewing',
    label: 'Interviewing',
    description: 'In active interview process',
    color: 'purple',
  },
  {
    value: 'offer',
    label: 'Offer',
    description: 'Received job offer, evaluating terms',
    color: 'green',
  },
  {
    value: 'accepted',
    label: 'Accepted',
    description: 'Offer accepted, employment confirmed',
    color: 'emerald',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Application was not successful',
    color: 'red',
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    description: 'Application withdrawn by candidate',
    color: 'slate',
  },
];

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'red' },
] as const;

/**
 * Work types
 */
export const WORK_TYPES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const;

/**
 * Employment types
 */
export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
] as const;

/**
 * Company sizes
 */
export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1001-5000', label: '1001-5000 employees' },
  { value: '5001+', label: '5001+ employees' },
] as const;

/**
 * Industries
 */
export const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'energy', label: 'Energy' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Document types
 */
export const DOCUMENT_TYPES = [
  { value: 'resume', label: 'Resume', icon: 'FileText' },
  { value: 'cv', label: 'CV', icon: 'FileText' },
  { value: 'cover-letter', label: 'Cover Letter', icon: 'Mail' },
  { value: 'portfolio', label: 'Portfolio', icon: 'Briefcase' },
  { value: 'transcript', label: 'Transcript', icon: 'GraduationCap' },
  { value: 'certification', label: 'Certification', icon: 'Award' },
  { value: 'other', label: 'Other', icon: 'File' },
] as const;

/**
 * Interview types
 */
export const INTERVIEW_TYPES = [
  'phone-screen',
  'video',
  'on-site',
  'technical',
  'behavioral',
  'panel',
  'final',
  'other',
] as const;

/**
 * Interview statuses
 */
export const INTERVIEW_STATUSES = [
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled',
  'no-show',
] as const;

/**
 * Currency options
 */

/**
 * Contact relationship types
 */
export const CONTACT_RELATIONSHIPS = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'hiring-manager', label: 'Hiring Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Currency options
 */
export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'CAD', label: 'CAD ($)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD ($)', symbol: 'A$' },
] as const;

/**
 * Application sources
 */
export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Referral',
  'Recruiter',
  'Job Board',
  'Networking Event',
  'Other',
] as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  APPLICATIONS: 'thrive_applications',
  DOCUMENTS: 'thrive_documents',
  COMPANIES: 'thrive_companies',
  PREFERENCES: 'thrive_preferences',
  THEME: 'thrive_theme',
} as const;

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'THRIVE',
  version: '0.0.1',
  description: 'Job Application Tracker',
  author: 'Your Name',
  github: 'https://github.com/adriandarian/thrive',
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;
