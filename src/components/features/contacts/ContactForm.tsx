import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT_RELATIONSHIPS } from '@/lib/constants';
import { useCompaniesStore } from '@/stores/companiesStore';
import type { Contact } from '@/types';

// Form schema based on contact schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  title: z.string().max(200).optional(),
  email: z.string().email('Must be a valid email').or(z.literal('')).optional(),
  phone: z.string().max(50).optional(),
  linkedIn: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  relationship: z.enum(['recruiter', 'hiring-manager', 'employee', 'referral', 'other']).optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: Partial<Contact>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactForm({ contact, onSubmit, onCancel, isLoading = false }: ContactFormProps) {
  const { companies } = useCompaniesStore();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact?.name || '',
      companyId: contact?.companyId || undefined,
      companyName: contact?.companyName || '',
      title: contact?.title || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      linkedIn: contact?.linkedIn || '',
      relationship: contact?.relationship || undefined,
      notes: contact?.notes || '',
    },
  });

  const selectedCompanyId = form.watch('companyId');

  const handleSubmit = (values: ContactFormValues) => {
    // Get company name if company is selected
    let companyName = values.companyName;
    if (values.companyId && !companyName) {
      const selectedCompany = companies.find((c) => c.id === values.companyId);
      companyName = selectedCompany?.name;
    }

    // Transform form values to Contact format
    const contactData: Partial<Contact> = {
      name: values.name,
      companyId: values.companyId || undefined,
      companyName: companyName || undefined,
      title: values.title || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      linkedIn: values.linkedIn || undefined,
      relationship: values.relationship || undefined,
      notes: values.notes || undefined,
    };

    onSubmit(contactData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Link this contact to a company</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!selectedCompanyId && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TechCorp Inc" {...field} />
                    </FormControl>
                    <FormDescription>Or enter a company name manually</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Recruiter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTACT_RELATIONSHIPS.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>How do you know this contact?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Details</h3>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.smith@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://linkedin.com/in/johnsmith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notes</h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes about this contact, conversations, or follow-ups..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
