import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useApplicationsStore } from '@/stores';
import type { Application, ApplicationStatus } from '@/types';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

export function KanbanBoard() {
  const { getFilteredApplications, updateApplication } = useApplicationsStore();
  const applications = getFilteredApplications();
  const [activeCard, setActiveCard] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group applications by status
  const applicationsByStatus = useMemo(() => {
    const grouped = new Map<ApplicationStatus, Application[]>();
    
    // Initialize all statuses with empty arrays
    for (const status of APPLICATION_STATUSES) {
      grouped.set(status.value, []);
    }
    
    // Group applications
    for (const app of applications) {
      const statusApps = grouped.get(app.status) || [];
      statusApps.push(app);
      grouped.set(app.status, statusApps);
    }
    
    return grouped;
  }, [applications]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const application = applications.find((app) => app.id === active.id);
    if (application) {
      setActiveCard(application);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveCard(null);
      return;
    }

    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    // Check if the status is valid
    const isValidStatus = APPLICATION_STATUSES.some((s) => s.value === newStatus);
    if (!isValidStatus) {
      setActiveCard(null);
      return;
    }

    // Update application status
    const application = applications.find((app) => app.id === applicationId);
    if (application && application.status !== newStatus) {
      updateApplication(applicationId, { status: newStatus });
      
      // Find the new status label for the toast
      const statusLabel = APPLICATION_STATUSES.find((s) => s.value === newStatus)?.label || newStatus;
      
      // Show success toast with application details
      toast.success('Status Updated', {
        description: `${application.position} moved to ${statusLabel}`,
      });
    }

    setActiveCard(null);
  };

  const handleDragCancel = () => {
    setActiveCard(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => {
          const columnApplications = applicationsByStatus.get(status.value) || [];
          
          return (
            <SortableContext
              key={status.value}
              id={status.value}
              items={columnApplications.map((app) => app.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                status={status}
                applications={columnApplications}
                count={columnApplications.length}
              />
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>
        {activeCard ? <KanbanCard application={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
