import { Eye, EyeOff, LayoutGrid, Settings2, X } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useDashboardStore } from '@/stores/dashboardStore';

export function DashboardCustomizer() {
  const { widgets, layoutMode, setLayoutMode, toggleWidget, resetToDefault } = useDashboardStore();

  const visibleCount = widgets.filter((w) => w.visible).length;

  return (
    <div className="flex items-center gap-2">
      {/* Edit Mode Toggle */}
      <AnimatedButton
        variant={layoutMode === 'edit' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLayoutMode(layoutMode === 'view' ? 'edit' : 'view')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        {layoutMode === 'edit' ? 'Done Editing' : 'Customize Layout'}
      </AnimatedButton>

      {/* Settings Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4 mr-2" />
            Widgets
            <Badge variant="secondary" className="ml-2">
              {visibleCount}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Dashboard Widgets</SheetTitle>
            <SheetDescription>
              Toggle widgets on or off to customize your dashboard view
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Widget List */}
            <div className="space-y-4">
              {widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <Card key={widget.id}>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-sm">{widget.title}</CardTitle>
                            {widget.visible ? (
                              <Eye className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </div>
                          <CardDescription className="text-xs">{widget.description}</CardDescription>
                        </div>
                        <Switch
                          checked={widget.visible}
                          onCheckedChange={() => toggleWidget(widget.id)}
                        />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Visible Widgets</Label>
                <Badge variant="outline">
                  {visibleCount} of {widgets.length}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  resetToDefault();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
