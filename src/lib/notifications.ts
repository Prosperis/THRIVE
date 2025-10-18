import { toast } from 'sonner';
import { useSettingsStore } from '@/stores/settingsStore';

/**
 * Notification helper that respects user's notification preferences
 */
export const notify = {
  /**
   * Show a backup reminder notification
   */
  backupReminder: (message: string, description?: string) => {
    const { notifications } = useSettingsStore.getState();
    if (notifications.backupReminders) {
      toast.info(message, {
        description,
        duration: 5000,
      });
    }
  },

  /**
   * Show a status change notification
   */
  statusChange: (message: string, description?: string) => {
    const { notifications } = useSettingsStore.getState();
    if (notifications.statusChanges) {
      toast.success(message, {
        description,
        duration: 3000,
      });
    }
  },

  /**
   * Show a deadline alert notification
   */
  deadlineAlert: (message: string, description?: string) => {
    const { notifications } = useSettingsStore.getState();
    if (notifications.deadlineAlerts) {
      toast.warning(message, {
        description,
        duration: 5000,
      });
    }
  },

  /**
   * Show an interview reminder notification
   */
  interviewReminder: (message: string, description?: string) => {
    const { notifications } = useSettingsStore.getState();
    if (notifications.interviewReminders) {
      toast.info(message, {
        description,
        duration: 5000,
      });
    }
  },

  /**
   * Always show success notifications (not affected by preferences)
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Always show error notifications (not affected by preferences)
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Always show info notifications (not affected by preferences)
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Always show warning notifications (not affected by preferences)
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },
};
