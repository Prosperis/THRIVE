/**
 * Application Status Enum
 * Following the THRIVE acronym: Target, Hunt, Reach, Interview, Validate, Employ
 */
export type ApplicationStatus =
  | 'target' // TARGET: Companies/positions you're interested in
  | 'hunting' // HUNT: Actively researching and preparing application
  | 'applied' // REACH: Application submitted
  | 'interviewing' // INTERVIEW: In interview process
  | 'offer' // VALIDATE: Received offer, evaluating
  | 'accepted' // EMPLOY: Accepted offer
  | 'rejected' // Application was rejected
  | 'withdrawn'; // You withdrew application

/**
 * Main Application entity
 */
export interface Application {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;

  // Dates
  targetDate?: Date; // When you targeted this position
  appliedDate?: Date; // When you submitted application
  firstInterviewDate?: Date;
  offerDate?: Date;
  responseDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Job Details
  location?: string;
  workType?: 'remote' | 'hybrid' | 'onsite';
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: SalaryRange;
  jobUrl?: string;
  jobDescription?: string;

  // Relationships
  contacts?: Contact[];
  interviews?: Interview[];
  documentIds?: string[]; // IDs of documents used

  // Notes and tracking
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  source?: string; // Where you found the job (LinkedIn, referral, etc.)
  referralName?: string;
  sortOrder?: number; // Custom sort order within status column
}

/**
 * Salary Range
 */
export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period?: 'hourly' | 'annual';
}

/**
 * Interview entity
 */
export interface Interview {
  id: string;
  applicationId: string;
  round: number; // 1st interview, 2nd interview, etc.
  type: 'phone-screen' | 'video' | 'on-site' | 'technical' | 'behavioral' | 'panel' | 'final' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';

  scheduledAt?: Date; // Renamed from scheduledDate
  duration?: number; // minutes
  location?: string;
  meetingUrl?: string; // For virtual interviews

  interviewers?: Interviewer[];

  // Preparation and notes
  preparationNotes?: string;
  questionsAsked?: string[];
  questionsToAsk?: string[];

  // Post-interview
  feedback?: string;
  followUpSent?: boolean;
  followUpDate?: Date;

  result?: 'passed' | 'failed' | 'pending';

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interviewer information
 */
export interface Interviewer {
  name: string;
  title?: string;
  linkedIn?: string;
  email?: string;
  notes?: string;
}

/**
 * Contact at company
 */
export interface Contact {
  id: string;
  name: string;
  companyId?: string; // Link to company
  companyName?: string; // Denormalized for display
  title?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  notes?: string;
  relationship?: 'recruiter' | 'hiring-manager' | 'employee' | 'referral' | 'other';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Document entity (Resume, CV, Cover Letter, etc.)
 */
export interface Document {
  id: string;
  name: string;
  type: 'resume' | 'cv' | 'cover-letter' | 'portfolio' | 'transcript' | 'certification' | 'other';

  // File info
  fileName?: string;
  fileUrl?: string; // Local path or URL
  url?: string; // Alternative field name
  fileSize?: number; // bytes
  mimeType?: string;
  content?: string; // For text-based documents

  // Versioning
  version: number;
  baseDocumentId?: string; // If this is a version of another doc

  // Tracking
  applicationId?: string; // Primary application this document is for
  usedInApplicationIds?: string[]; // All applications where this was used
  lastUsedDate?: Date;

  // Metadata
  tags?: string[];
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Company research and notes
 */
export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;

  // Research
  description?: string;
  culture?: string;
  techStack?: string[];
  benefits?: string[];

  // Notes
  pros?: string[];
  cons?: string[];
  notes?: string;

  // Tracking
  applicationIds: string[]; // Applications to this company

  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  // Display
  theme?: 'light' | 'dark' | 'system';
  compactMode?: boolean;

  // Defaults
  defaultCurrency?: string;

  // Notifications
  emailReminders?: boolean;
  deadlineReminders?: boolean;
  reminderDaysBefore?: number;

  // Data
  autoSave?: boolean;

  // Export
  exportFormat?: 'json' | 'csv' | 'pdf';
}

/**
 * Filter and search criteria
 */
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  priority?: ('low' | 'medium' | 'high')[];
  tags?: string[];
  searchQuery?: string;
  workType?: ('remote' | 'hybrid' | 'onsite')[];
  employmentType?: ('full-time' | 'part-time' | 'contract' | 'internship')[];
}

/**
 * Interview filter and search criteria
 */
export interface InterviewFilters {
  type?: ('phone-screen' | 'video' | 'on-site' | 'technical' | 'behavioral' | 'panel' | 'final' | 'other')[];
  status?: ('scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show')[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string; // Search by application name
}

/**
 * Statistics and analytics
 */
export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  averageResponseTime?: number; // days
  successRate?: number; // percentage
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
}
