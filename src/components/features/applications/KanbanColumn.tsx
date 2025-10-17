import { useDroppable } from '@dnd-kit/core';
import type { Application, ApplicationStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: {
    value: ApplicationStatus;
    label: string;
    description: string;
    color: string;
  };
  applications: Application[];
  count: number;
}

const colorClasses: Record<string, string> = {
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
};

export function KanbanColumn({ status, applications, count }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.value,
  });

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', colorClasses[status.color] || 'bg-gray-500')} />
          <h3 className="font-semibold text-sm">{status.label}</h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
      </div>

      {/* Column Description */}
      <p className="text-xs text-muted-foreground mb-3">{status.description}</p>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-lg border-2 border-dashed bg-muted/20 p-2 min-h-[400px] transition-colors',
          isOver && 'border-primary bg-primary/10'
        )}
      >
        <div className="space-y-2">
          {applications.map((application) => (
            <KanbanCard key={application.id} application={application} />
          ))}
          
          {applications.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No applications
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
