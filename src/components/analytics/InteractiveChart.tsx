import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export interface DrillDownData {
  title: string;
  items: Array<{
    id: string;
    company: string;
    position: string;
    status: string;
    date?: Date;
    [key: string]: unknown;
  }>;
}

interface InteractiveChartProps {
  children: React.ReactNode;
  onDataPointClick?: (data: unknown) => DrillDownData | null;
  enableZoom?: boolean;
  enableDrillDown?: boolean;
  className?: string;
}

export function InteractiveChart({
  children,
  onDataPointClick,
  enableZoom = true,
  enableDrillDown = true,
  className,
}: InteractiveChartProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleDataPointClick = (data: unknown) => {
    if (enableDrillDown && onDataPointClick) {
      const result = onDataPointClick(data);
      if (result) {
        setDrillDownData(result);
      }
    }
  };

  return (
    <>
      <div className={`relative ${className || ''}`}>
        {/* Chart Controls */}
        {enableZoom && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.6}
              className="h-7 w-7 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              className="h-7 w-7 p-0"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="h-7 w-7 p-0"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Chart Content */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
          onClick={(e) => {
            // Pass click events to chart elements
            const target = e.target as HTMLElement;
            if (target.closest('[data-chart-item]')) {
              const data = (target.closest('[data-chart-item]') as HTMLElement).dataset.chartData;
              if (data) {
                handleDataPointClick(JSON.parse(data));
              }
            }
          }}
        >
          {children}
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
          <DialogHeader>
            <DialogTitle>Chart View</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-auto">{children}</div>
        </DialogContent>
      </Dialog>

      {/* Drill-Down Dialog */}
      <Dialog open={!!drillDownData} onOpenChange={() => setDrillDownData(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{drillDownData?.title}</DialogTitle>
            <DialogDescription>
              {drillDownData?.items.length} application{drillDownData?.items.length !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            {drillDownData?.items.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b last:border-b-0 hover:bg-muted/50 rounded transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.company}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.position}</p>
                    {item.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${
                      item.status === 'offer'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : item.status === 'interviewing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          : item.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Enhanced tooltip component for charts with detailed information
 */
interface EnhancedTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    payload?: Record<string, unknown>;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
  title?: string;
  formatter?: (value: number | string, name?: string) => React.ReactNode;
  additionalInfo?: (payload: Record<string, unknown>) => React.ReactNode;
}

export function EnhancedTooltip({
  active,
  payload,
  label,
  title,
  formatter,
  additionalInfo,
}: EnhancedTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;

  return (
    <div className="bg-popover border border-border rounded-lg shadow-xl p-4 max-w-xs">
      {/* Header */}
      <div className="border-b border-border pb-2 mb-2">
        <p className="font-semibold text-sm">{title || label}</p>
      </div>

      {/* Metrics */}
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey || entry.name}-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {entry.color && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
              )}
              <span className="text-sm text-muted-foreground truncate">
                {entry.name || entry.dataKey}:
              </span>
            </div>
            <span className="font-medium text-sm flex-shrink-0">
              {formatter && entry.value !== undefined
                ? formatter(entry.value, entry.name)
                : entry.value}
            </span>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {additionalInfo && data && (
        <div className="border-t border-border pt-2 mt-2">
          <div className="text-xs text-muted-foreground">{additionalInfo(data)}</div>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="border-t border-border pt-2 mt-3">
        <p className="text-xs text-muted-foreground italic">Click to view details</p>
      </div>
    </div>
  );
}
