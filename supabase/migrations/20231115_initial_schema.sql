-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE application_status AS ENUM (
  'target',
  'hunting', 
  'applied',
  'interviewing',
  'offer',
  'accepted',
  'rejected',
  'withdrawn'
);

CREATE TYPE work_type AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE salary_period AS ENUM ('hourly', 'annual');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE interview_type AS ENUM (
  'recruiter-screen',
  'phone-screen',
  'hiring-manager-chat',
  'video',
  'technical-assessment',
  'on-site',
  'technical-interview',
  'behavioral-interview',
  'leadership-interview',
  'panel',
  'final',
  'other'
);
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show');
CREATE TYPE interview_result AS ENUM ('passed', 'failed', 'pending');
CREATE TYPE company_status AS ENUM ('target', 'researching', 'applied', 'interviewing', 'rejected', 'not-interested');
CREATE TYPE contact_relationship AS ENUM ('recruiter', 'hiring-manager', 'employee', 'referral', 'other');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE experience AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE document_type AS ENUM ('resume', 'cv', 'cover-letter', 'portfolio', 'transcript', 'certification', 'other');
CREATE TYPE remote_policy AS ENUM ('full-remote', 'hybrid', 'on-site', 'flexible');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'target',
  
  -- Dates
  target_date DATE,
  applied_date DATE,
  first_interview_date DATE,
  offer_date DATE,
  response_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Job Details
  location TEXT,
  work_type work_type,
  employment_type employment_type,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  salary_period salary_period,
  job_url TEXT,
  job_description TEXT,
  
  -- Notes and tracking
  notes TEXT,
  tags TEXT[],
  priority priority DEFAULT 'medium',
  source TEXT,
  referral_name TEXT,
  sort_order INTEGER
);

-- Create interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  type interview_type NOT NULL,
  status interview_status NOT NULL DEFAULT 'scheduled',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- minutes
  location TEXT,
  meeting_url TEXT,
  
  -- Preparation and notes
  preparation_notes TEXT,
  questions_asked TEXT[],
  questions_to_ask TEXT[],
  
  -- Post-interview
  feedback TEXT,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  result interview_result,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT[],
  size TEXT,
  location TEXT,
  founded TEXT,
  remote_policy remote_policy,
  
  -- Research & Description
  description TEXT,
  culture TEXT,
  culture_notes TEXT,
  tech_stack TEXT[],
  benefits TEXT[],
  
  -- Analysis & Notes
  pros TEXT[],
  cons TEXT[],
  notes TEXT,
  employee_reviews TEXT,
  news_and_updates TEXT,
  competitor_comparison TEXT,
  
  -- Company Links (JSON)
  company_links JSONB,
  ratings JSONB,
  ats_params JSONB,
  
  -- Interview Information
  interview_process TEXT,
  interview_difficulty difficulty,
  interview_experience experience,
  
  -- Compensation
  salary_range JSONB,
  
  -- Tracking & Status
  status company_status DEFAULT 'target',
  priority priority DEFAULT 'medium',
  researched BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  company_name TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  notes TEXT,
  relationship contact_relationship,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type document_type NOT NULL,
  
  -- File info
  file_name TEXT,
  file_url TEXT,
  url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  content TEXT,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  version_name TEXT,
  base_document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  
  -- Tracking
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  used_in_application_ids UUID[],
  last_used_date DATE,
  
  -- Metadata
  tags TEXT[],
  notes TEXT,
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interviewers table (separate from contacts)
CREATE TABLE interviewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  linkedin TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_version_links table
CREATE TABLE document_version_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type document_type NOT NULL,
  version INTEGER NOT NULL,
  version_name TEXT,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_company_name ON applications(company_name);
CREATE INDEX idx_applications_created_at ON applications(created_at);

CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_application_id ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_status ON companies(status);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(type);

CREATE INDEX idx_document_version_links_application_id ON document_version_links(application_id);
CREATE INDEX idx_document_version_links_document_id ON document_version_links(document_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_version_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own interviews" ON interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON interviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own companies" ON companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own companies" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own companies" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own companies" ON companies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contacts" ON contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON contacts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own interviewers" ON interviewers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM interviews 
    WHERE interviews.id = interviewers.interview_id 
    AND interviews.user_id = auth.uid()
  )
);
CREATE POLICY "Users can manage own interviewers" ON interviewers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM interviews 
    WHERE interviews.id = interviewers.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own document version links" ON document_version_links FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.id = document_version_links.application_id 
    AND applications.user_id = auth.uid()
  )
);
CREATE POLICY "Users can manage own document version links" ON document_version_links FOR ALL USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.id = document_version_links.application_id 
    AND applications.user_id = auth.uid()
  )
);