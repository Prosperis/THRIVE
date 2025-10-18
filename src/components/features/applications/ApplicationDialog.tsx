import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplicationForm } from './ApplicationForm';
import { useApplicationsStore } from '@/stores/applicationsStore';
import type { Application } from '@/types';

interface ApplicationDialogProps {
  application?: Application;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ApplicationDialog({
  application,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ApplicationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addApplication, updateApplication } = useApplicationsStore();

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const handleSubmit = async (data: Partial<Application>) => {
    setIsLoading(true);
    
    try {
      if (application) {
        // Update existing application
        await updateApplication(application.id, data);
      } else {
        // Create new application
        await addApplication(data as Omit<Application, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to save application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? 'Edit Application' : 'Create New Application'}
          </DialogTitle>
          <DialogDescription>
            {application
              ? 'Update the details of this job application.'
              : 'Add a new job application to track your progress.'}
          </DialogDescription>
        </DialogHeader>

        <ApplicationForm
          application={application}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
