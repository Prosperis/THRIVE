/**
 * Activity Timeline Types
 */

export type ActivityType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'note_added'
  | 'document_uploaded'
  | 'contact_added'
  | 'deadline_set'
  | 'follow_up_set'
  | 'tag_added'
  | 'tag_removed';

export interface Activity {
  id: string;
  type: ActivityType;
  entityId: string;
  entityType: 'application' | 'interview' | 'document' | 'contact';
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Note Types
 */
export interface Note {
  id: string;
  content: string;
  entityId: string;
  entityType: 'application' | 'interview' | 'contact';
  category?: 'general' | 'research' | 'interview' | 'follow-up' | 'technical' | 'cultural';
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tag Types
 */
export interface Tag {
  id: string;
  name: string;
  color?: string;
  category?: 'priority' | 'status' | 'custom';
  description?: string;
  usageCount: number;
  createdAt: Date;
}

/**
 * Predefined tags for common use cases
 */
export const PREDEFINED_TAGS: Omit<Tag, 'id' | 'usageCount' | 'createdAt'>[] = [
  {
    name: 'Urgent',
    color: '#ef4444',
    category: 'priority',
    description: 'High priority, immediate attention needed',
  },
  {
    name: 'Dream Job',
    color: '#8b5cf6',
    category: 'priority',
    description: 'Top choice opportunity',
  },
  {
    name: 'Referral',
    color: '#10b981',
    category: 'status',
    description: 'Applied through employee referral',
  },
  {
    name: 'Remote',
    color: '#3b82f6',
    category: 'status',
    description: 'Remote work opportunity',
  },
  {
    name: 'Hybrid',
    color: '#06b6d4',
    category: 'status',
    description: 'Hybrid work arrangement',
  },
  {
    name: 'On-site',
    color: '#6366f1',
    category: 'status',
    description: 'On-site work required',
  },
  {
    name: 'Visa Sponsorship',
    color: '#f59e0b',
    category: 'status',
    description: 'Offers visa sponsorship',
  },
  {
    name: 'Startup',
    color: '#ec4899',
    category: 'custom',
    description: 'Startup company',
  },
  {
    name: 'Enterprise',
    color: '#64748b',
    category: 'custom',
    description: 'Large enterprise company',
  },
  {
    name: 'Follow Up Soon',
    color: '#f97316',
    category: 'priority',
    description: 'Requires follow-up soon',
  },
];

/**
 * Activity descriptions for different activity types
 */
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  created: 'Created',
  updated: 'Updated',
  status_changed: 'Status changed',
  interview_scheduled: 'Interview scheduled',
  interview_completed: 'Interview completed',
  note_added: 'Note added',
  document_uploaded: 'Document uploaded',
  contact_added: 'Contact added',
  deadline_set: 'Deadline set',
  follow_up_set: 'Follow-up set',
  tag_added: 'Tag added',
  tag_removed: 'Tag removed',
};
