import { 
  Eye, 
  EyeOff, 
  LayoutGrid, 
  X, 
  Zap, 
  Clock 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useDashboardStore, type DashboardWidgetType } from '@/stores/dashboardStore';

// Mini preview component for each widget type
const WidgetPreview = ({ type }: { type: DashboardWidgetType }) => {
  const baseClass = "w-full h-16 rounded border bg-card p-2 flex items-center justify-center";
  
  switch (type) {
    case 'stats':
      return (
        <div className={baseClass}>
          <div className="flex gap-1 w-full h-full items-end justify-around">
            <div className="w-2 bg-primary/30 h-[30%] rounded-sm" />
            <div className="w-2 bg-primary/50 h-[60%] rounded-sm" />
            <div className="w-2 bg-primary/70 h-[45%] rounded-sm" />
            <div className="w-2 bg-primary h-[80%] rounded-sm" />
          </div>
        </div>
      );
    
    case 'funnel':
      return (
        <div className={baseClass}>
          <div className="flex flex-col gap-1 w-full items-center">
            <div className="w-[90%] h-2 bg-primary/70 rounded-sm" />
            <div className="w-[70%] h-2 bg-primary/50 rounded-sm" />
            <div className="w-[50%] h-2 bg-primary/30 rounded-sm" />
          </div>
        </div>
      );
    
    case 'timeline':
      return (
        <div className={baseClass}>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <div className="flex-1 h-1 bg-primary/30 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary/50" />
              <div className="flex-1 h-1 bg-primary/20 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary/30" />
              <div className="flex-1 h-1 bg-primary/10 rounded-sm" />
            </div>
          </div>
        </div>
      );
    
    case 'status-distribution':
      return (
        <div className={baseClass}>
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </div>
      );
    
    case 'response-metrics':
      return (
        <div className={baseClass}>
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-full h-full" aria-label="Response metrics gauge">
              <title>Response metrics gauge</title>
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/20" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" className="text-primary" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
            </svg>
          </div>
        </div>
      );
    
    case 'quick-actions':
      return (
        <div className={baseClass}>
          <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
            <div className="bg-primary/30 rounded-sm flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <div className="bg-primary/20 rounded-sm" />
            <div className="bg-primary/20 rounded-sm" />
            <div className="bg-primary/20 rounded-sm" />
          </div>
        </div>
      );
    
    case 'recent-activity':
      return (
        <div className={baseClass}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2 text-primary" />
              <div className="flex-1 h-1 bg-primary/30 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2 text-primary/50" />
              <div className="flex-1 h-1 bg-primary/20 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2 text-primary/30" />
              <div className="flex-1 h-1 bg-primary/10 rounded-sm" />
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className={baseClass}>
          <LayoutGrid className="h-6 w-6 text-muted-foreground" />
        </div>
      );
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
      <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Dashboard Widgets</SheetTitle>
            <SheetDescription>
              Toggle widgets on or off to customize your dashboard view
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Widget Grid */}
          <div className="flex-1 overflow-y-auto mt-6">
            <div className="grid grid-cols-2 gap-3 pr-2">
              {widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <button
                    key={widget.id}
                    type="button"
                    onClick={() => toggleWidget(widget.id)}
                    className={cn(
                      "relative group rounded-lg border-2 transition-all p-3 text-left cursor-pointer hover:border-primary/50",
                      widget.visible 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-background hover:bg-accent"
                    )}
                  >
                    {/* Visibility indicator */}
                    <div className="absolute top-2 right-2">
                      {widget.visible ? (
                        <Eye className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Widget Preview */}
                    <div className="mb-2">
                      <WidgetPreview type={widget.id} />
                    </div>
                    
                    {/* Widget Info */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium leading-tight">
                        {widget.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                        {widget.description}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="pt-4 border-t mt-4">
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
        </SheetContent>
      </Sheet>
  );
}
