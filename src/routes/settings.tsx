import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/components/layout';
import { toast } from 'sonner';
import {
  Palette,
  Bell,
  Database,
  Info,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Globe,
  Calendar,
  Clock,
  Layout,
  Save,
  AlertTriangle,
} from 'lucide-react';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { display, notifications, data, updateDisplay, updateNotifications, updateData, resetToDefaults } =
    useSettingsStore();

  const handleThemeChange = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      if (newTheme === 'system') {
        // Get system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      } else {
        setTheme(newTheme);
      }
      updateDisplay({ theme: newTheme });
      toast.success('Theme Updated', {
        description: `Theme changed to ${newTheme}`,
      });
    },
    [setTheme, updateDisplay]
  );

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      resetToDefaults();
      // Reset theme to system
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      toast.success('Settings Reset', {
        description: 'All settings have been reset to defaults',
      });
    }
  }, [resetToDefaults, setTheme]);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your application preferences and configurations
            </p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Theme & Display Settings */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Theme & Display</h2>
                <p className="text-sm text-muted-foreground">
                  Customize the appearance of your application
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme Selection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={display.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={display.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={display.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
                <Select
                  value={display.language}
                  onValueChange={(value: 'en' | 'es' | 'fr' | 'de') => {
                    updateDisplay({ language: value });
                    toast.success('Language Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Format */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Format
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose how dates are displayed
                  </p>
                </div>
                <Select
                  value={display.dateFormat}
                  onValueChange={(value: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD') => {
                    updateDisplay({ dateFormat: value });
                    toast.success('Date Format Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time Format
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose 12-hour or 24-hour format
                  </p>
                </div>
                <Select
                  value={display.timeFormat}
                  onValueChange={(value: '12h' | '24h') => {
                    updateDisplay({ timeFormat: value });
                    toast.success('Time Format Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (3:00 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (15:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for more content
                  </p>
                </div>
                <Switch
                  checked={display.compactMode}
                  onCheckedChange={(checked: boolean) => {
                    updateDisplay({ compactMode: checked });
                    toast.success(checked ? 'Compact Mode Enabled' : 'Compact Mode Disabled');
                  }}
                />
              </div>

              {/* Show Avatars */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Avatars</Label>
                  <p className="text-sm text-muted-foreground">
                    Display profile pictures and icons
                  </p>
                </div>
                <Switch
                  checked={display.showAvatars}
                  onCheckedChange={(checked: boolean) => {
                    updateDisplay({ showAvatars: checked });
                    toast.success(checked ? 'Avatars Shown' : 'Avatars Hidden');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Manage when and how you receive notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Backup Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded when it's time to backup
                  </p>
                </div>
                <Switch
                  checked={notifications.backupReminders}
                  onCheckedChange={(checked: boolean) =>
                    updateNotifications({ backupReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Status Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when application status changes
                  </p>
                </div>
                <Switch
                  checked={notifications.statusChanges}
                  onCheckedChange={(checked: boolean) =>
                    updateNotifications({ statusChanges: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Deadline Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert for upcoming response deadlines
                  </p>
                </div>
                <Switch
                  checked={notifications.deadlineAlerts}
                  onCheckedChange={(checked: boolean) =>
                    updateNotifications({ deadlineAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Interview Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind about upcoming interviews
                  </p>
                </div>
                <Switch
                  checked={notifications.interviewReminders}
                  onCheckedChange={(checked: boolean) =>
                    updateNotifications({ interviewReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    Email Notifications
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    updateNotifications({ emailNotifications: checked })
                  }
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Data & View Settings */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Data & Views</h2>
                <p className="text-sm text-muted-foreground">
                  Configure how data is displayed and managed
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Default View */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Default View
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred application view
                  </p>
                </div>
                <Select
                  value={data.defaultView}
                  onValueChange={(value: 'table' | 'kanban') => {
                    updateData({ defaultView: value });
                    toast.success('Default View Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table View</SelectItem>
                    <SelectItem value="kanban">Kanban Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Items Per Page</Label>
                  <p className="text-sm text-muted-foreground">
                    Number of items to display per page
                  </p>
                </div>
                <Select
                  value={String(data.itemsPerPage)}
                  onValueChange={(value) => {
                    updateData({ itemsPerPage: parseInt(value) as 10 | 25 | 50 | 100 });
                    toast.success('Items Per Page Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="25">25 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Auto Save
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes as you work
                  </p>
                </div>
                <Switch
                  checked={data.autoSave}
                  onCheckedChange={(checked: boolean) => {
                    updateData({ autoSave: checked });
                    toast.success(checked ? 'Auto Save Enabled' : 'Auto Save Disabled');
                  }}
                />
              </div>

              {/* Confirm Delete */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Confirm Delete
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show confirmation dialog before deleting
                  </p>
                </div>
                <Switch
                  checked={data.confirmDelete}
                  onCheckedChange={(checked: boolean) => {
                    updateData({ confirmDelete: checked });
                    toast.success(
                      checked ? 'Delete Confirmation Enabled' : 'Delete Confirmation Disabled'
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">About Thrive</h2>
                <p className="text-sm text-muted-foreground">Application information and resources</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Build</p>
                <p className="font-medium">2025.01.18</p>
              </div>
              <div>
                <p className="text-muted-foreground">Environment</p>
                <p className="font-medium">Development</p>
              </div>
              <div>
                <p className="text-muted-foreground">Storage</p>
                <p className="font-medium">IndexedDB</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/adriandarian/thrive"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: '/' })}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
