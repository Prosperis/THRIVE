import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPANY_SIZES, INDUSTRIES } from '@/lib/constants';
import type { Company } from '@/types';

// Form schema based on company schema
const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().max(200).optional(),
  description: z.string().optional(),
  culture: z.string().optional(),
  techStack: z.string().optional(), // Comma-separated
  benefits: z.string().optional(), // Comma-separated
  pros: z.string().optional(), // Comma-separated
  cons: z.string().optional(), // Comma-separated
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: Partial<Company>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompanyForm({
  company,
  onSubmit,
  onCancel,
  isLoading = false,
}: CompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || '',
      website: company?.website || '',
      industry: company?.industry || undefined,
      size: company?.size || undefined,
      location: company?.location || '',
      description: company?.description || '',
      culture: company?.culture || '',
      techStack: company?.techStack?.join(', ') || '',
      benefits: company?.benefits?.join(', ') || '',
      pros: company?.pros?.join(', ') || '',
      cons: company?.cons?.join(', ') || '',
      notes: company?.notes || '',
    },
  });

  const handleSubmit = (values: CompanyFormValues) => {
    // Transform form values to Company format
    const companyData: Partial<Company> = {
      name: values.name,
      website: values.website || undefined,
      industry: values.industry || undefined,
      size: values.size || undefined,
      location: values.location || undefined,
      description: values.description || undefined,
      culture: values.culture || undefined,
      techStack: values.techStack
        ? values.techStack.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
      benefits: values.benefits
        ? values.benefits.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
      pros: values.pros
        ? values.pros.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
      cons: values.cons
        ? values.cons.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
      notes: values.notes || undefined,
    };

    onSubmit(companyData);
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
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TechCorp Inc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
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
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
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
                <FormDescription>
                  Headquarters or main office location
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Research */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Research</h3>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What does the company do?"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="culture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Culture</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes about company culture, values, work environment..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                  <Input placeholder="React, TypeScript, Node.js, PostgreSQL" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated list of technologies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <FormControl>
                  <Input placeholder="Health insurance, 401k, Remote work, PTO" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated list of benefits and perks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Analysis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analysis</h3>
          
          <FormField
            control={form.control}
            name="pros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pros</FormLabel>
                <FormControl>
                  <Input placeholder="Great culture, Competitive salary, Growth opportunities" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated list of positive aspects
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cons</FormLabel>
                <FormControl>
                  <Input placeholder="Long commute, Startup uncertainty, Limited benefits" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated list of concerns or drawbacks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other notes about this company..."
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
            {isLoading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
