import type { WidgetId } from '@/stores/dashboardLayoutStore';

interface WidgetContainerProps {
  widgetId: WidgetId;
  isVisible: boolean;
  children: React.ReactNode;
}

/**
 * Simple wrapper that shows/hides widgets based on layout visibility settings
 */
export function WidgetContainer({ widgetId, isVisible, children }: WidgetContainerProps) {
  if (!isVisible) return null;
  
  return <div data-widget-id={widgetId}>{children}</div>;
}
