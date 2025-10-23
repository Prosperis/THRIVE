import { createFileRoute } from '@tanstack/react-router';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Database,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Heart,
  History,
  Info,
  Keyboard,
  Layout,
  Palette,
  RotateCcw,
  Save,
  Scale,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ChangelogDialog } from '@/components/features/settings/ChangelogDialog';
import { KeyboardShortcutsDialog } from '@/components/features/settings/KeyboardShortcutsDialog';
import { PageTransition } from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CREDITS, HELP_RESOURCES } from '@/lib/about';
import { useSettingsStore } from '@/stores/settingsStore';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const {
    display,
    notifications,
    data,
    documents,
    updateDisplay,
    updateNotifications,
    updateData,
    updateDocuments,
    resetToDefaults,
  } = useSettingsStore();

  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const handleReset = useCallback(() => {
    if (
      confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')
    ) {
      resetToDefaults();
      toast.success('Settings Reset', {
        description: 'All settings have been reset to defaults',
      });
    }
  }, [resetToDefaults]);

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
              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </Label>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
                <Select
                  value={display.language}
                  onValueChange={(value: 'en' | 'es' | 'fr' | 'de' | 'fa') => {
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
                    <SelectItem value="fa">فارسی (Persian)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar Type */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Calendar Type
                  </Label>
                  <p className="text-sm text-muted-foreground">Choose calendar system</p>
                </div>
                <Select
                  value={display.calendarType}
                  onValueChange={(value: 'gregorian' | 'persian') => {
                    updateDisplay({ calendarType: value });
                    toast.success('Calendar Type Updated');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian">Gregorian</SelectItem>
                    <SelectItem value="persian">Persian (Jalali)</SelectItem>
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
                  <p className="text-sm text-muted-foreground">Choose how dates are displayed</p>
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
                  <p className="text-sm text-muted-foreground">Choose 12-hour or 24-hour format</p>
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
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
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
                  <p className="text-sm text-muted-foreground">Remind about upcoming interviews</p>
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
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
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
                    updateData({ itemsPerPage: Number.parseInt(value, 10) as 10 | 25 | 50 | 100 });
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

          {/* Documents Section */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Manage document deletion and recovery settings
                </p>
              </div>
            </div>

            <div className="space-y-4 pl-[52px]">
              {/* Auto Delete Days */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Delete After (Days)</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete documents after this many days
                  </p>
                </div>
                <Select
                  value={String(documents.autoDeleteDays)}
                  onValueChange={(value) => {
                    const days = Number.parseInt(value, 10);
                    updateDocuments({ autoDeleteDays: days });
                    toast.success('Auto Delete Setting Updated', {
                      description: `Documents will be permanently deleted after ${days} days`,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recently Deleted Days */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Recently Deleted (Days)</Label>
                  <p className="text-sm text-muted-foreground">
                    Display deleted documents within this timeframe
                  </p>
                </div>
                <Select
                  value={String(documents.recentlyDeletedDays)}
                  onValueChange={(value) => {
                    const days = Number.parseInt(value, 10);
                    updateDocuments({ recentlyDeletedDays: days });
                    toast.success('Recently Deleted Display Updated', {
                      description: `Showing deleted documents from the last ${days} days`,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Documents are soft-deleted when you click the trash icon. 
                  They remain recoverable in the "Recently Deleted" tab until the auto-delete period expires. 
                  After that, they are permanently removed from the database.
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Application information and resources
                </p>
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

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangelogOpen(true)}
                className="justify-start"
              >
                <History className="mr-2 h-4 w-4" />
                Changelog
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShortcutsOpen(true)}
                className="justify-start"
              >
                <Keyboard className="mr-2 h-4 w-4" />
                Shortcuts
              </Button>
              <Button variant="outline" size="sm" asChild className="justify-start">
                <a
                  href="https://github.com/adriandarian/thrive"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                  <ExternalLink className="ml-auto h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="justify-start">
                <a
                  href="https://github.com/adriandarian/thrive/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                  <ExternalLink className="ml-auto h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Help Resources */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Help & Resources</h2>
                <p className="text-sm text-muted-foreground">Learn more and get support</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HELP_RESOURCES.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{resource.title}</h3>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Credits & Attribution</h2>
                <p className="text-sm text-muted-foreground">
                  Built with amazing open source libraries
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {CREDITS.map((section) => (
                <div key={section.category} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors group text-sm"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </a>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <a
                            href={item.licenseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="View license"
                          >
                            <Scale className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                          </a>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="View repository"
                          >
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ChangelogDialog open={isChangelogOpen} onOpenChange={setIsChangelogOpen} />
      <KeyboardShortcutsDialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen} />
    </PageTransition>
  );
}

  
