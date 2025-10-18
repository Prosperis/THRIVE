import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CompanyForm } from './CompanyForm';
import { useCompaniesStore } from '@/stores/companiesStore';
import type { Company } from '@/types';

interface CompanyDialogProps {
  company?: Company;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CompanyDialog({
  company,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CompanyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addCompany, updateCompany } = useCompaniesStore();

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const handleSubmit = async (data: Partial<Company>) => {
    setIsLoading(true);
    
    try {
      if (company) {
        // Update existing company
        await updateCompany(company.id, data);
      } else {
        // Create new company
        await addCompany(data as Omit<Company, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to save company:', error);
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
            {company ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
          <DialogDescription>
            {company
              ? 'Update the company information and research notes.'
              : 'Add a new company to track and research for potential opportunities.'}
          </DialogDescription>
        </DialogHeader>

        <CompanyForm
          company={company}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
