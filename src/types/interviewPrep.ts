export type QuestionCategory =
  | 'behavioral'
  | 'technical'
  | 'system-design'
  | 'coding'
  | 'company-specific'
  | 'leadership'
  | 'problem-solving';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type ChallengeStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'submitted'
  | 'reviewed';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty?: QuestionDifficulty;
  tags?: string[];
  isCommon?: boolean; // For common question database
  companyId?: string; // Link to specific company
  createdAt: Date;
  updatedAt: Date;
}

export interface PrepAnswer {
  id: string;
  questionId: string;
  answer: string;
  notes?: string;
  version: number; // For revision history
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyPrepNote {
  id: string;
  companyName: string;
  applicationId?: string; // Link to application if exists
  interviewId?: string; // Link to interview if exists
  notes: string;
  researched: boolean;
  companyLinks?: {
    website?: string;
    linkedin?: string;
    glassdoor?: string;
    careers?: string;
  };
  cultureNotes?: string;
  techStack?: string[];
  interviewProcess?: string;
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicalChallenge {
  id: string;
  title: string;
  description: string;
  companyName?: string;
  applicationId?: string;
  type: 'coding' | 'system-design' | 'take-home' | 'technical-assessment';
  status: ChallengeStatus;
  difficulty?: QuestionDifficulty;
  timeLimit?: number; // in minutes
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  submittedAt?: Date;
  notes?: string;
  solution?: string;
  feedbackReceived?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeSession {
  id: string;
  questionId: string;
  answerId?: string;
  duration?: number; // in seconds
  rating?: number; // 1-5
  notes?: string;
  improvements?: string;
  createdAt: Date;
}

// Common questions database
export interface CommonQuestion {
  question: string;
  category: QuestionCategory;
  difficulty?: QuestionDifficulty;
  tips?: string;
  tags?: string[];
}

// Statistics
export interface PrepStats {
  totalQuestions: number;
  answeredQuestions: number;
  practiceSessionsCount: number;
  averageRating: number;
  questionsByCategory: Record<QuestionCategory, number>;
  companiesResearched: number;
  challengesCompleted: number;
  challengesPending: number;
}
