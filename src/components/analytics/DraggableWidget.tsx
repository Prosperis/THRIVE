import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { WidgetId } from '@/stores/dashboardLayoutStore';

interface DraggableWidgetProps {
  id: WidgetId;
  children: React.ReactNode;
  isEditMode: boolean;
}

export function DraggableWidget({ id, children, isEditMode }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-2 top-4 z-10 cursor-grab active:cursor-grabbing bg-muted/80 backdrop-blur-sm rounded p-1 hover:bg-muted transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className={isEditMode ? 'pl-4' : ''}>{children}</div>
    </div>
  );
}
