import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, MoreVertical, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnnotationsStore, type AnnotationType } from '@/stores/annotationsStore';
import { AnnotationDialog } from './AnnotationDialog';
import { toast } from 'sonner';

const ANNOTATION_TYPE_ICONS: Record<AnnotationType, string> = {
  milestone: '🎯',
  note: '📝',
  reminder: '⏰',
  event: '🎉',
};

const ANNOTATION_TYPE_LABELS: Record<AnnotationType, string> = {
  milestone: 'Milestone',
  note: 'Note',
  reminder: 'Reminder',
  event: 'Event',
};

export function AnnotationsList() {
  const { annotations, deleteAnnotation } = useAnnotationsStore();
  const [filterType, setFilterType] = useState<AnnotationType | 'all'>('all');

  const filteredAnnotations = filterType === 'all'
    ? annotations
    : annotations.filter((a) => a.type === filterType);

  const sortedAnnotations = [...filteredAnnotations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string, title: string) => {
    deleteAnnotation(id);
    toast.success(`Deleted "${title}"`);
  };

  if (annotations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Annotations</CardTitle>
              <CardDescription>Mark important dates and events</CardDescription>
            </div>
            <AnnotationDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mb-4 opacity-20 mx-auto" />
            <p className="text-sm text-muted-foreground mb-4">
              No annotations yet. Add notes, milestones, or reminders to track important moments.
            </p>
            <AnnotationDialog trigger={<Button>Add First Annotation</Button>} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Annotations ({annotations.length})</CardTitle>
            <CardDescription>Your notes, milestones, and reminders</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as AnnotationType | 'all')}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="milestone">🎯 Milestones</SelectItem>
                <SelectItem value="note">📝 Notes</SelectItem>
                <SelectItem value="reminder">⏰ Reminders</SelectItem>
                <SelectItem value="event">🎉 Events</SelectItem>
              </SelectContent>
            </Select>
            <AnnotationDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAnnotations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No annotations match the selected filter.</p>
            </div>
          ) : (
            sortedAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                style={{ borderLeftWidth: '3px', borderLeftColor: annotation.color }}
              >
                <div className="text-2xl flex-shrink-0">
                  {ANNOTATION_TYPE_ICONS[annotation.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{annotation.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(annotation.date), 'MMM dd, yyyy')} · {ANNOTATION_TYPE_LABELS[annotation.type]}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(annotation.id, annotation.title)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {annotation.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {annotation.description}
                    </p>
                  )}
                  {annotation.tags && annotation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {annotation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
