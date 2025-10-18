/**
 * Template System Types
 */

export type TemplateCategory = 
  | 'application'
  | 'email'
  | 'cover-letter'
  | 'note'
  | 'other';

export type TemplateVariableType = 
  | 'text'
  | 'date'
  | 'company'
  | 'position'
  | 'name'
  | 'custom';

/**
 * Template variable definition
 */
export interface TemplateVariable {
  key: string;
  label: string;
  type: TemplateVariableType;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

/**
 * Template entity
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  content: string;
  variables: TemplateVariable[];
  tags?: string[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

/**
 * Template with resolved variables
 */
export interface ResolvedTemplate {
  content: string;
  variables: Record<string, string>;
}

/**
 * Default template presets
 */
export const DEFAULT_TEMPLATES: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
  {
    name: 'Software Engineer Application',
    description: 'Standard application template for software engineering positions',
    category: 'application',
    isDefault: true,
    tags: ['engineering', 'tech'],
    content: `Application for {{position}} at {{company}}

I am writing to express my strong interest in the {{position}} role at {{company}}. With {{yearsOfExperience}} years of experience in software development, I am confident that my skills align well with your team's needs.

Key qualifications:
- {{skill1}}
- {{skill2}}
- {{skill3}}

I am excited about the opportunity to contribute to {{company}}'s mission and would welcome the chance to discuss how my background matches your needs.

Best regards,
{{yourName}}`,
    variables: [
      { key: 'position', label: 'Position', type: 'position', required: true },
      { key: 'company', label: 'Company', type: 'company', required: true },
      { key: 'yourName', label: 'Your Name', type: 'name', required: true },
      { key: 'yearsOfExperience', label: 'Years of Experience', type: 'text', defaultValue: '5' },
      { key: 'skill1', label: 'Key Skill 1', type: 'text', placeholder: 'e.g., React & TypeScript' },
      { key: 'skill2', label: 'Key Skill 2', type: 'text', placeholder: 'e.g., System Design' },
      { key: 'skill3', label: 'Key Skill 3', type: 'text', placeholder: 'e.g., Team Leadership' },
    ],
  },
  {
    name: 'Follow-up Email',
    description: 'Professional follow-up email after submitting an application',
    category: 'email',
    isDefault: true,
    tags: ['follow-up', 'email'],
    content: `Subject: Following Up on {{position}} Application

Dear {{hiringManager}},

I hope this email finds you well. I am writing to follow up on my application for the {{position}} role at {{company}}, which I submitted on {{applicationDate}}.

I remain very interested in this opportunity and would welcome the chance to discuss how my experience aligns with your team's needs. {{additionalContext}}

Thank you for considering my application. I look forward to hearing from you.

Best regards,
{{yourName}}
{{yourEmail}}
{{yourPhone}}`,
    variables: [
      { key: 'position', label: 'Position', type: 'position', required: true },
      { key: 'company', label: 'Company', type: 'company', required: true },
      { key: 'hiringManager', label: 'Hiring Manager', type: 'name', placeholder: 'Hiring Manager' },
      { key: 'applicationDate', label: 'Application Date', type: 'date', required: true },
      { key: 'additionalContext', label: 'Additional Context', type: 'text', placeholder: 'Optional additional information' },
      { key: 'yourName', label: 'Your Name', type: 'name', required: true },
      { key: 'yourEmail', label: 'Your Email', type: 'text', required: true },
      { key: 'yourPhone', label: 'Your Phone', type: 'text' },
    ],
  },
  {
    name: 'Thank You Email',
    description: 'Thank you email to send after an interview',
    category: 'email',
    isDefault: true,
    tags: ['thank-you', 'interview', 'email'],
    content: `Subject: Thank You - {{position}} Interview

Dear {{interviewer}},

Thank you for taking the time to meet with me {{interviewDate}} to discuss the {{position}} opportunity at {{company}}. I enjoyed learning more about the role and the team.

{{specificDetail}}

I am very excited about the possibility of joining {{company}} and contributing to {{projectOrGoal}}. Please don't hesitate to reach out if you need any additional information.

Thank you again for your time and consideration.

Best regards,
{{yourName}}`,
    variables: [
      { key: 'position', label: 'Position', type: 'position', required: true },
      { key: 'company', label: 'Company', type: 'company', required: true },
      { key: 'interviewer', label: 'Interviewer Name', type: 'name', required: true },
      { key: 'interviewDate', label: 'Interview Date', type: 'date', defaultValue: 'today' },
      { key: 'specificDetail', label: 'Specific Detail', type: 'text', placeholder: 'Mention something specific from the interview' },
      { key: 'projectOrGoal', label: 'Project/Goal', type: 'text', placeholder: 'Specific project or company goal discussed' },
      { key: 'yourName', label: 'Your Name', type: 'name', required: true },
    ],
  },
  {
    name: 'Networking Cold Outreach',
    description: 'Professional cold outreach for networking and referrals',
    category: 'email',
    isDefault: true,
    tags: ['networking', 'referral', 'email'],
    content: `Subject: {{connectionReason}} - {{position}} at {{company}}

Hi {{contactName}},

{{introduction}}

I noticed you work at {{company}} and I'm very interested in the {{position}} role that was recently posted. I would greatly appreciate any insights you could share about the team, culture, or role, or if you'd be willing to refer me.

{{whyInterested}}

Would you be open to a brief call this week? I'm happy to work around your schedule.

Thank you for considering my request!

Best regards,
{{yourName}}
{{yourLinkedIn}}`,
    variables: [
      { key: 'contactName', label: 'Contact Name', type: 'name', required: true },
      { key: 'connectionReason', label: 'Connection Reason', type: 'text', placeholder: 'e.g., Fellow Alumni, Mutual Connection' },
      { key: 'introduction', label: 'Introduction', type: 'text', placeholder: 'How you know them or found them' },
      { key: 'company', label: 'Company', type: 'company', required: true },
      { key: 'position', label: 'Position', type: 'position', required: true },
      { key: 'whyInterested', label: 'Why Interested', type: 'text', placeholder: 'Brief reason for interest in the role' },
      { key: 'yourName', label: 'Your Name', type: 'name', required: true },
      { key: 'yourLinkedIn', label: 'Your LinkedIn', type: 'text' },
    ],
  },
  {
    name: 'Status Inquiry',
    description: 'Polite inquiry about application status',
    category: 'email',
    isDefault: true,
    tags: ['status', 'follow-up', 'email'],
    content: `Subject: Application Status - {{position}}

Dear {{hiringManager}},

I hope this message finds you well. I wanted to reach out regarding my application for the {{position}} role at {{company}}, submitted {{timeAgo}}.

I remain very interested in this opportunity and would appreciate any update you could provide on the timeline for next steps.

Thank you for your time and consideration.

Best regards,
{{yourName}}`,
    variables: [
      { key: 'position', label: 'Position', type: 'position', required: true },
      { key: 'company', label: 'Company', type: 'company', required: true },
      { key: 'hiringManager', label: 'Hiring Manager', type: 'name', placeholder: 'Hiring Manager' },
      { key: 'timeAgo', label: 'Time Since Application', type: 'text', placeholder: 'e.g., 2 weeks ago' },
      { key: 'yourName', label: 'Your Name', type: 'name', required: true },
    ],
  },
];
