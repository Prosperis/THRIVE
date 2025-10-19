// @ts-nocheck - Complex react-hook-form type inference issues with Zod resolver

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
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  PRIORITY_LEVELS,
  WORK_TYPES,
} from '@/lib/constants';
import type { Application } from '@/types';

// Form schema based on application schema
const applicationFormSchema = z.object({
  position: z.string().min(1, 'Position is required').max(200),
  companyName: z.string().min(1, 'Company name is required').max(200),
  status: z.enum([
    'target',
    'hunting',
    'applied',
    'interviewing',
    'offer',
    'accepted',
    'rejected',
    'withdrawn',
  ]),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  workType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  location: z.string().max(200).optional(),
  jobUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  salaryCurrency: z.string().optional(),
  targetDate: z.string().optional(),
  appliedDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: Partial<Application>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicationForm({
  application,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApplicationFormProps) {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      position: application?.position || '',
      companyName: application?.companyName || '',
      status: application?.status || 'target',
      priority: application?.priority || 'medium',
      workType: application?.workType || undefined,
      employmentType: application?.employmentType || undefined,
      location: application?.location || '',
      jobUrl: application?.jobUrl || '',
      salaryMin: application?.salary?.min || undefined,
      salaryMax: application?.salary?.max || undefined,
      salaryCurrency: application?.salary?.currency || 'USD',
      targetDate: application?.targetDate
        ? new Date(application.targetDate).toISOString().split('T')[0]
        : '',
      appliedDate: application?.appliedDate
        ? new Date(application.appliedDate).toISOString().split('T')[0]
        : '',
      notes: application?.notes || '',
      tags: application?.tags?.join(', ') || '',
    },
  });

  const handleSubmit = (values: ApplicationFormValues) => {
    // Transform form values to Application format
    const applicationData: Partial<Application> = {
      position: values.position,
      companyName: values.companyName,
      status: values.status,
      priority: values.priority,
      workType: values.workType,
      employmentType: values.employmentType,
      location: values.location || undefined,
      jobUrl: values.jobUrl || undefined,
      salary:
        values.salaryMin || values.salaryMax
          ? {
              min: values.salaryMin,
              max: values.salaryMax,
              currency: values.salaryCurrency,
            }
          : undefined,
      targetDate: values.targetDate ? new Date(values.targetDate) : undefined,
      appliedDate: values.appliedDate ? new Date(values.appliedDate) : undefined,
      notes: values.notes || undefined,
      tags: values.tags
        ? values.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    onSubmit(applicationData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TechCorp Inc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Job Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORK_TYPES.map((workType) => (
                        <SelectItem key={workType.value} value={workType.value}>
                          {workType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((empType) => (
                        <SelectItem key={empType.value} value={empType.value}>
                          {empType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://company.com/jobs/123" {...field} />
                </FormControl>
                <FormDescription>Link to the job posting</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Salary Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Salary Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="150000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="USD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Important Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Important Dates</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>When you identified this opportunity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applied Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>When you submitted your application</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="react, typescript, remote" {...field} />
                </FormControl>
                <FormDescription>Comma-separated tags for organization</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any notes about this application..."
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
            {isLoading ? 'Saving...' : application ? 'Update Application' : 'Create Application'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
