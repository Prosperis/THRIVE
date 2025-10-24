import { Check, Copy, LayoutDashboard, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AVAILABLE_WIDGETS,
  DEFAULT_LAYOUTS,
  useDashboardLayoutStore,
  type WidgetId,
} from '@/stores/dashboardLayoutStore';

export function LayoutManager() {
  const {
    currentLayoutId,
    customLayouts,
    getCurrentLayout,
    setCurrentLayout,
    createCustomLayout,
    deleteCustomLayout,
    duplicateLayout,
    toggleWidgetVisibility,
    resetToDefault,
  } = useDashboardLayoutStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');

  const currentLayout = getCurrentLayout();
  const allLayouts = [...DEFAULT_LAYOUTS, ...customLayouts];

  const handleCreateLayout = () => {
    if (!newLayoutName.trim()) {
      toast.error('Please enter a layout name');
      return;
    }

    createCustomLayout(newLayoutName, newLayoutDescription, currentLayoutId);
    toast.success(`Layout "${newLayoutName}" created!`);
    setNewLayoutName('');
    setNewLayoutDescription('');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteLayout = (layoutId: string) => {
    const layout = customLayouts.find((l) => l.id === layoutId);
    if (layout) {
      deleteCustomLayout(layoutId);
      toast.success(`Layout "${layout.name}" deleted`);
    }
  };

  const handleDuplicateLayout = (layoutId: string) => {
    const layout = allLayouts.find((l) => l.id === layoutId);
    if (layout) {
      const newName = `${layout.name} (Copy)`;
      duplicateLayout(layoutId, newName);
      toast.success(`Layout duplicated as "${newName}"`);
    }
  };

  const handleResetToDefault = () => {
    resetToDefault();
    toast.success('Reset to default layout');
    setIsManageDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Layout Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>{currentLayout.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px]">
          <DropdownMenuLabel>Dashboard Layouts</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Default Layouts */}
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Preset Layouts
          </DropdownMenuLabel>
          {DEFAULT_LAYOUTS.map((layout) => (
            <DropdownMenuItem
              key={layout.id}
              onClick={() => setCurrentLayout(layout.id)}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-medium">{layout.name}</div>
                <div className="text-xs text-muted-foreground">{layout.description}</div>
              </div>
              {currentLayoutId === layout.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}

          {/* Custom Layouts */}
          {customLayouts.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Custom Layouts
              </DropdownMenuLabel>
              {customLayouts.map((layout) => (
                <DropdownMenuItem
                  key={layout.id}
                  onClick={() => setCurrentLayout(layout.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium">{layout.name}</div>
                    <div className="text-xs text-muted-foreground">{layout.description}</div>
                  </div>
                  {currentLayoutId === layout.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create New Layout */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Layout</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Layout</DialogTitle>
            <DialogDescription>
              Create a new dashboard layout based on your current view
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout-name">Layout Name</Label>
              <Input
                id="layout-name"
                placeholder="My Custom Layout"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout-description">Description (optional)</Label>
              <Textarea
                id="layout-description"
                placeholder="Describe what this layout is for..."
                value={newLayoutDescription}
                onChange={(e) => setNewLayoutDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              The new layout will include all widgets from your current view:{' '}
              <strong>{currentLayout.name}</strong>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLayout}>Create Layout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Layouts */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage Dashboard Layouts</DialogTitle>
            <DialogDescription>
              Customize widgets and manage your dashboard layouts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-auto max-h-[60vh]">
            {/* Widget Visibility */}
            <div className="space-y-3">
              <h3 className="font-semibold">Widget Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Toggle widgets on/off for the current layout
              </p>
              <div className="grid gap-2">
                {AVAILABLE_WIDGETS.map((widget) => (
                  <label
                    key={widget.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={currentLayout.widgetVisibility[widget.id]}
                      onChange={() => toggleWidgetVisibility(widget.id as WidgetId)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{widget.name}</div>
                      <div className="text-xs text-muted-foreground">{widget.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Manage Custom Layouts */}
            {customLayouts.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold">Custom Layouts</h3>
                <div className="grid gap-2">
                  {customLayouts.map((layout) => (
                    <div
                      key={layout.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{layout.name}</div>
                        <div className="text-xs text-muted-foreground">{layout.description}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateLayout(layout.id)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLayout(layout.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Option */}
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={handleResetToDefault} className="w-full">
                Reset to Default Layout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
