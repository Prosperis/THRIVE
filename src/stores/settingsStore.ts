import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

export interface NotificationSettings {
  backupReminders: boolean;
  statusChanges: boolean;
  deadlineAlerts: boolean;
  interviewReminders: boolean;
  emailNotifications: boolean;
}

export interface DisplaySettings {
  theme: Theme;
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  compactMode: boolean;
  showAvatars: boolean;
}

export interface DataSettings {
  defaultView: 'table' | 'kanban';
  itemsPerPage: 10 | 25 | 50 | 100;
  autoSave: boolean;
  confirmDelete: boolean;
}

interface SettingsState {
  display: DisplaySettings;
  notifications: NotificationSettings;
  data: DataSettings;

  // Actions
  updateDisplay: (settings: Partial<DisplaySettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateData: (settings: Partial<DataSettings>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_DISPLAY: DisplaySettings = {
  theme: 'system',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  compactMode: false,
  showAvatars: true,
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  backupReminders: true,
  statusChanges: true,
  deadlineAlerts: true,
  interviewReminders: true,
  emailNotifications: false,
};

const DEFAULT_DATA: DataSettings = {
  defaultView: 'table',
  itemsPerPage: 25,
  autoSave: true,
  confirmDelete: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      display: DEFAULT_DISPLAY,
      notifications: DEFAULT_NOTIFICATIONS,
      data: DEFAULT_DATA,

      updateDisplay: (settings) => {
        set((state) => ({
          display: { ...state.display, ...settings },
        }));
      },

      updateNotifications: (settings) => {
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        }));
      },

      updateData: (settings) => {
        set((state) => ({
          data: { ...state.data, ...settings },
        }));
      },

      resetToDefaults: () => {
        set({
          display: DEFAULT_DISPLAY,
          notifications: DEFAULT_NOTIFICATIONS,
          data: DEFAULT_DATA,
        });
      },
    }),
    {
      name: 'thrive-settings',
    }
  )
);
