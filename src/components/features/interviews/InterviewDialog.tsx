import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InterviewForm } from './InterviewForm';
import { useInterviewsStore } from '@/stores/interviewsStore';
import type { Interview } from '@/types';

interface InterviewDialogProps {
  interview?: Interview;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultApplicationId?: string;
}

export function InterviewDialog({
  interview,
  trigger,
  open: controlledOpen,
  onOpenChange,
  defaultApplicationId,
}: InterviewDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { addInterview, updateInterview, isLoading } = useInterviewsStore();

  // Use controlled or uncontrolled state
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Optional: Add any cleanup logic here
    }
  }, [open]);

  const handleSubmit = async (data: Partial<Interview>) => {
    try {
      if (interview) {
        await updateInterview(interview.id, data);
      } else {
        await addInterview(data as Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to save interview:', error);
      // Error handling is managed by the store
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const dialogContent = (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{interview ? 'Edit Interview' : 'Schedule Interview'}</DialogTitle>
        <DialogDescription>
          {interview
            ? 'Update the interview details below.'
            : 'Schedule a new interview for an application.'}
        </DialogDescription>
      </DialogHeader>
      <InterviewForm
        interview={interview}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        defaultApplicationId={defaultApplicationId}
      />
    </DialogContent>
  );

  // If trigger is provided, use it. Otherwise, just return the dialog content
  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogContent}
    </Dialog>
  );
}
