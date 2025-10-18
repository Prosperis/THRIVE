import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import type { Application } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedBadge } from '@/components/ui/animated-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  Eye,
  Pencil,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { useApplicationsStore } from '@/stores';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  application: Application;
  isOverlay?: boolean;
}

const priorityColors: Record<NonNullable<Application['priority']>, string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
};

const workTypeIcons: Record<NonNullable<Application['workType']>, string> = {
  remote: '🏠',
  hybrid: '🔄',
  onsite: '🏢',
};

export function KanbanCard({ application, isOverlay = false }: KanbanCardProps) {
  const { deleteApplication } = useApplicationsStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card
        ref={setNodeRef}
        style={style}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isOverlay && 'rotate-3 shadow-lg',
        isDragging && 'opacity-50'
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{application.position}</h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{application.companyName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {application.priority && (
              <AnimatedBadge 
                className={cn('text-xs h-5', priorityColors[application.priority])} 
                variant="outline"
                animateOnMount={false}
              >
                {application.priority}
              </AnimatedBadge>
            )}
            
            {!isOverlay && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteApplication(application.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0 space-y-2">
        {/* Location & Work Type */}
        {(application.location || application.workType) && (
          <div className="flex items-center gap-2 text-xs">
            {application.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{application.location}</span>
              </div>
            )}
            {application.workType && (
              <Badge variant="secondary" className="text-xs h-5">
                {workTypeIcons[application.workType]} {application.workType}
              </Badge>
            )}
          </div>
        )}

        {/* Salary */}
        {application.salary && (application.salary.min || application.salary.max) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>
              {application.salary.min && application.salary.max
                ? `${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: application.salary.currency || 'USD',
                    maximumFractionDigits: 0,
                  }).format(application.salary.min)} - ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: application.salary.currency || 'USD',
                    maximumFractionDigits: 0,
                  }).format(application.salary.max)}`
                : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: application.salary.currency || 'USD',
                    maximumFractionDigits: 0,
                  }).format(application.salary.min || application.salary.max || 0)}
            </span>
          </div>
        )}

        {/* Dates */}
        {application.appliedDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>
        )}

        {/* Tags */}
        {application.tags && application.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {application.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs h-5">
                {tag}
              </Badge>
            ))}
            {application.tags.length > 3 && (
              <Badge variant="outline" className="text-xs h-5">
                +{application.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Drag Handle */}
        {!isOverlay && (
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center pt-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );

  return cardContent;
}
