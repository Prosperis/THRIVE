import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DashboardWidgetType } from '@/stores/dashboardStore';

interface DashboardWidgetWrapperProps {
  id: DashboardWidgetType;
  isEditMode: boolean;
  children: ReactNode;
}

export function DashboardWidgetWrapper({
  id,
  isEditMode,
  children,
}: DashboardWidgetWrapperProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging,
    isOver 
  } = useSortable({
    id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all',
        isDragging && 'opacity-30',
        isOver && 'ring-2 ring-dashed ring-primary ring-offset-4 ring-offset-background rounded-lg scale-[1.02]',
        isEditMode && 'cursor-grab active:cursor-grabbing'
      )}
    >
      {/* Drop indicator overlay */}
      {isOver && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none z-0" />
      )}
      
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className={cn(isEditMode && 'pointer-events-none select-none', 'relative z-[1]')}>{children}</div>
    </div>
  );
}
