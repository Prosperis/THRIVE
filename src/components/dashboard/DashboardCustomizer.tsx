import { 
  Eye, 
  EyeOff, 
  LayoutGrid, 
  X, 
  BarChart3, 
  TrendingDown, 
  Calendar, 
  PieChart, 
  Gauge, 
  Zap, 
  Clock 
} from 'lucide-react';
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
import { useDashboardStore, type DashboardWidgetType } from '@/stores/dashboardStore';

// Get icon component for each widget type
const getWidgetIcon = (type: DashboardWidgetType) => {
  const iconProps = { className: 'h-3.5 w-3.5' };
  
  switch (type) {
    case 'stats':
      return <BarChart3 {...iconProps} />;
    case 'funnel':
      return <TrendingDown {...iconProps} />;
    case 'timeline':
      return <Calendar {...iconProps} />;
    case 'status-distribution':
      return <PieChart {...iconProps} />;
    case 'response-metrics':
      return <Gauge {...iconProps} />;
    case 'quick-actions':
      return <Zap {...iconProps} />;
    case 'recent-activity':
      return <Clock {...iconProps} />;
    default:
      return <LayoutGrid {...iconProps} />;
  }
};

export function DashboardCustomizer() {
  const { widgets, toggleWidget, resetToDefault } = useDashboardStore();

  const visibleCount = widgets.filter((w) => w.visible).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Customize Layout
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
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Widget Icon Preview */}
                          <div className="flex-shrink-0 mt-0.5 p-2 rounded-md bg-primary/10 text-primary">
                            {getWidgetIcon(widget.id)}
                          </div>
                          
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
  );
}
