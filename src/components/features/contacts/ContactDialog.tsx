import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useContactsStore } from '@/stores/contactsStore';
import type { Contact } from '@/types';
import { ContactForm } from './ContactForm';

interface ContactDialogProps {
  contact?: Contact;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContactDialog({
  contact,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ContactDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addContact, updateContact } = useContactsStore();

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const handleSubmit = async (data: Partial<Contact>) => {
    setIsLoading(true);

    try {
      if (contact) {
        // Update existing contact
        await updateContact(contact.id, data);
      } else {
        // Create new contact
        await addContact(data as Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>);
      }

      setOpen(false);
    } catch (error) {
      console.error('Failed to save contact:', error);
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
          <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {contact
              ? 'Update the contact information and notes.'
              : 'Add a new contact to keep track of recruiters, hiring managers, and other professional connections.'}
          </DialogDescription>
        </DialogHeader>

        <ContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
