import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardWidgetType =
  | 'stats'
  | 'funnel'
  | 'timeline'
  | 'status-distribution'
  | 'response-metrics'
  | 'quick-actions'
  | 'recent-activity';

export interface DashboardWidget {
  id: DashboardWidgetType;
  title: string;
  description: string;
  visible: boolean;
  order: number;
}

interface DashboardState {
  widgets: DashboardWidget[];
  toggleWidget: (id: DashboardWidgetType) => void;
  reorderWidgets: (widgets: DashboardWidget[]) => void;
  resetToDefault: () => void;
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'stats',
    title: 'Statistics Overview',
    description: 'Key metrics at a glance',
    visible: true,
    order: 0,
  },
  {
    id: 'funnel',
    title: 'Application Funnel',
    description: 'Track your application pipeline',
    visible: true,
    order: 1,
  },
  {
    id: 'timeline',
    title: 'Applications Timeline',
    description: 'Applications over time',
    visible: true,
    order: 2,
  },
  {
    id: 'status-distribution',
    title: 'Status Distribution',
    description: 'Application status breakdown',
    visible: true,
    order: 3,
  },
  {
    id: 'response-metrics',
    title: 'Response Metrics',
    description: 'Response rate analytics',
    visible: true,
    order: 4,
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Common tasks and shortcuts',
    visible: true,
    order: 5,
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    description: 'Latest updates and changes',
    visible: true,
    order: 6,
  },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === id ? { ...widget, visible: !widget.visible } : widget
          ),
        })),

      reorderWidgets: (widgets) =>
        set({
          widgets: widgets.map((widget, index) => ({
            ...widget,
            order: index,
          })),
        }),

      resetToDefault: () =>
        set({
          widgets: defaultWidgets,
        }),
    }),
    {
      name: 'dashboard-layout',
    }
  )
);
