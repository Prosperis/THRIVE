export type NotificationType =
  | 'deadline'
  | 'follow-up'
  | 'interview'
  | 'application-update'
  | 'reminder'
  | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'pending' | 'sent' | 'read' | 'dismissed' | 'snoozed';

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  
  // Scheduling
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
  snoozedUntil?: Date;
  
  // Related entities
  applicationId?: string;
  interviewId?: string;
  documentId?: string;
  
  // Action
  actionLabel?: string;
  actionUrl?: string;
  
  // Metadata
  isRecurring: boolean;
  frequency?: ReminderFrequency;
  parentReminderId?: string; // For recurring reminders
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  priority: NotificationPriority;
  
  // Scheduling
  reminderDate: Date;
  isRecurring: boolean;
  frequency?: ReminderFrequency;
  endDate?: Date; // For recurring reminders
  
  // Related entities
  applicationId?: string;
  interviewId?: string;
  companyName?: string;
  
  // Notifications
  notifyBefore?: number; // Minutes before to notify
  notifyVia: ('app' | 'browser')[];
  
  // Status
  isActive: boolean;
  lastTriggered?: Date;
  nextTrigger?: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  // Browser notifications
  browserNotificationsEnabled: boolean;
  
  // Notification types
  deadlineReminders: boolean;
  followUpReminders: boolean;
  interviewReminders: boolean;
  applicationUpdates: boolean;
  
  // Timing
  defaultReminderTime: string; // e.g., "09:00"
  interviewReminderMinutes: number; // Minutes before interview
  followUpReminderDays: number; // Days after application
  
  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g., "22:00"
  quietHoursEnd: string; // e.g., "08:00"
  
  // Snooze
  defaultSnoozeMinutes: number;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  pendingCount: number;
  snoozedCount: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  upcomingReminders: number;
}

// Smart reminder suggestions based on application/interview data
export interface SmartReminderSuggestion {
  id: string;
  type: 'follow-up' | 'interview-prep' | 'deadline' | 'check-status';
  title: string;
  description: string;
  suggestedDate: Date;
  applicationId?: string;
  interviewId?: string;
  priority: NotificationPriority;
  reason: string; // Why this is being suggested
}
