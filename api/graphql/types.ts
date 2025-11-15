// GraphQL type definitions

// GraphQL Context interface
export interface Context {
  userId: string;
}

// GraphQL Resolver types
export interface ResolverParent {
  [key: string]: unknown;
}

// Company input types for GraphQL mutations
export interface CompanyInput {
  name: string;
  website?: string;
  industry?: string[];
  size?: string;
  location?: string;
  founded?: string;
  remotePolicy?: string;
  description?: string;
  culture?: string;
  cultureNotes?: string;
  techStack?: string[];
  benefits?: string[];
  pros?: string[];
  cons?: string[];
  notes?: string;
  employeeReviews?: string;
  newsAndUpdates?: string;
  competitorComparison?: string;
  companyLinks?: Record<string, unknown>;
  ratings?: Record<string, unknown>;
  atsParams?: Record<string, unknown>;
  interviewProcess?: string;
  interviewDifficulty?: string;
  interviewExperience?: string;
  salaryRange?: Record<string, unknown>;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  researched?: boolean;
  tags?: string[];
}

export interface CompanyUpdateInput extends Partial<CompanyInput> {}

// Database record types (what comes from the database)
export interface CompanyRecord {
  id: string;
  user_id: string;
  name: string;
  website?: string;
  industry?: string[];
  size?: string;
  location?: string;
  founded?: string;
  remote_policy?: string;
  description?: string;
  culture?: string;
  culture_notes?: string;
  tech_stack?: string[];
  benefits?: string[];
  pros?: string[];
  cons?: string[];
  notes?: string;
  employee_reviews?: string;
  news_and_updates?: string;
  competitor_comparison?: string;
  company_links?: Record<string, unknown>;
  ratings?: Record<string, unknown>;
  ats_params?: Record<string, unknown>;
  interview_process?: string;
  interview_difficulty?: string;
  interview_experience?: string;
  salary_range?: Record<string, unknown>;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  researched: boolean;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

// Analytics types
export interface ApplicationsOverTimeArgs {
  startDate: string;
  endDate: string;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  averageResponseTime?: number;
  successRate: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
}

export interface ApplicationRecordForAnalytics {
  created_at: Date;
  status: string;
}

// Contact types
export interface ContactInput {
  companyId?: string;
  companyName?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  linkedin?: string;
  notes?: string;
  isReferral?: boolean;
  tags?: string[];
}

export interface ContactUpdateInput extends Partial<ContactInput> {}

export interface ContactQueryArgs extends QueryArgs {
  id: string;
  companyId?: string;
}

export interface CreateContactArgs {
  input: ContactInput;
}

export interface UpdateContactArgs {
  id: string;
  input: ContactUpdateInput;
}

export interface DeleteContactArgs {
  id: string;
}

// Contact record types (what comes from the database)
export interface ContactRecord {
  id: string;
  user_id: string;
  company_id?: string;
  company_name?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  linkedin?: string;
  notes?: string;
  is_referral?: boolean;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

// Interview types
export interface InterviewInput {
  applicationId: string;
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'behavioral' | 'panel' | 'final';
  scheduledAt?: Date;
  duration?: number;
  location?: string;
  meetingLink?: string;
  preparationNotes?: string;
  questionsAsked?: string[];
  questionsToAsk?: string[];
  notes?: string;
  rating?: number;
  followUpSent?: boolean;
  followUpDate?: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  interviewers?: Array<{
    name: string;
    email?: string;
    role?: string;
    linkedin?: string;
  }>;
}

export interface InterviewUpdateInput extends Partial<InterviewInput> {}

export interface InterviewQueryArgs extends QueryArgs {
  id: string;
  applicationId?: string;
}

export interface CreateInterviewArgs {
  input: InterviewInput;
}

export interface UpdateInterviewArgs {
  id: string;
  input: InterviewUpdateInput;
}

export interface DeleteInterviewArgs {
  id: string;
}

// Interview record types (what comes from the database)
export interface InterviewRecord {
  id: string;
  user_id: string;
  application_id: string;
  type: string;
  scheduled_at?: Date;
  duration?: number;
  location?: string;
  meeting_link?: string;
  preparation_notes?: string;
  questions_asked?: string[];
  questions_to_ask?: string[];
  notes?: string;
  rating?: number;
  follow_up_sent?: boolean;
  follow_up_date?: Date;
  status: string;
  interviewers?: Array<{
    name: string;
    email?: string;
    role?: string;
    linkedin?: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

// GraphQL Query arguments
export interface QueryArgs {
  id?: string;
  status?: string;
}

export interface CompanyQueryArgs extends QueryArgs {
  id: string;
}

// GraphQL Mutation arguments
export interface CreateCompanyArgs {
  input: CompanyInput;
}

export interface UpdateCompanyArgs {
  id: string;
  input: CompanyUpdateInput;
}

export interface DeleteCompanyArgs {
  id: string;
}

// Application types
export interface ApplicationInput {
  companyName: string;
  position: string;
  status?:
    | 'target'
    | 'hunting'
    | 'applied'
    | 'interviewing'
    | 'offer'
    | 'accepted'
    | 'rejected'
    | 'withdrawn';
  targetDate?: Date;
  appliedDate?: Date;
  firstInterviewDate?: Date;
  offerDate?: Date;
  responseDeadline?: Date;
  location?: string;
  workType?: 'remote' | 'hybrid' | 'onsite';
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  jobUrl?: string;
  jobDescription?: string;
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  source?: string;
  referralName?: string;
  sortOrder?: number;
}

export interface ApplicationUpdateInput extends Partial<ApplicationInput> {}

export interface ApplicationQueryArgs extends QueryArgs {
  id: string;
  status: string;
}

export interface CreateApplicationArgs {
  input: ApplicationInput;
}

export interface UpdateApplicationArgs {
  id: string;
  input: ApplicationUpdateInput;
}

export interface DeleteApplicationArgs {
  id: string;
}

// Application record types (what comes from the database)
export interface ApplicationRecord {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  status: string;
  target_date?: Date;
  applied_date?: Date;
  first_interview_date?: Date;
  offer_date?: Date;
  response_deadline?: Date;
  location?: string;
  work_type?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  job_url?: string;
  job_description?: string;
  notes?: string;
  tags?: string[];
  priority?: string;
  source?: string;
  referral_name?: string;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

// Document types
export interface DocumentInput {
  name: string;
  type: 'resume' | 'cv' | 'cover-letter' | 'portfolio' | 'transcript' | 'certification' | 'other';
  fileName?: string;
  fileUrl?: string;
  url?: string;
  fileSize?: number;
  mimeType?: string;
  content?: string;
  version?: number;
  versionName?: string;
  baseDocumentId?: string;
  applicationId?: string;
  usedInApplicationIds?: string[];
  lastUsedDate?: Date;
  tags?: string[];
  notes?: string;
}

export interface DocumentUpdateInput extends Partial<DocumentInput> {}

export interface DocumentQueryArgs extends QueryArgs {
  id: string;
  applicationId?: string;
  baseDocumentId?: string;
}

export interface CreateDocumentArgs {
  input: DocumentInput;
}

export interface UpdateDocumentArgs {
  id: string;
  input: DocumentUpdateInput;
}

export interface DeleteDocumentArgs {
  id: string;
}

// Document record types (what comes from the database)
export interface DocumentRecord {
  id: string;
  user_id: string;
  name: string;
  type: string;
  file_name?: string;
  file_url?: string;
  url?: string;
  file_size?: number;
  mime_type?: string;
  content?: string;
  version: number;
  version_name?: string;
  base_document_id?: string;
  application_id?: string;
  used_in_application_ids?: string[];
  last_used_date?: Date;
  tags?: string[];
  notes?: string;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
