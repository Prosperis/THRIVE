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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  COMPANY_SIZES, 
  INDUSTRIES, 
  COMPANY_STATUSES, 
  REMOTE_POLICIES,
  PRIORITY_LEVELS,
  CURRENCIES,
} from '@/lib/constants';
import type { Company } from '@/types';

// Form schema based on company schema
const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().max(200).optional(),
  founded: z.string().optional(),
  remotePolicy: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  researched: z.boolean().optional(),
  description: z.string().optional(),
  culture: z.string().optional(),
  techStack: z.string().optional(), // Comma-separated
  benefits: z.string().optional(), // Comma-separated
  pros: z.string().optional(), // Comma-separated
  cons: z.string().optional(), // Comma-separated
  notes: z.string().optional(),
  // Company Links
  linkedinUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  glassdoorUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  careersUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  newsUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  // Ratings
  overallRating: z.number().min(0).max(5).optional(),
  workLifeBalanceRating: z.number().min(0).max(5).optional(),
  compensationRating: z.number().min(0).max(5).optional(),
  careerGrowthRating: z.number().min(0).max(5).optional(),
  managementRating: z.number().min(0).max(5).optional(),
  cultureRating: z.number().min(0).max(5).optional(),
  // Salary
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: Partial<Company>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompanyForm({ company, onSubmit, onCancel, isLoading = false }: CompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || '',
      website: company?.website || '',
      industry: company?.industry?.[0] || undefined,
      size: company?.size || undefined,
      location: company?.location || '',
      founded: company?.founded || '',
      remotePolicy: company?.remotePolicy || undefined,
      status: company?.status || undefined,
      priority: company?.priority || undefined,
      researched: company?.researched || false,
      description: company?.description || '',
      culture: company?.culture || '',
      techStack: company?.techStack?.join(', ') || '',
      benefits: company?.benefits?.join(', ') || '',
      pros: company?.pros?.join(', ') || '',
      cons: company?.cons?.join(', ') || '',
      notes: company?.notes || '',
      // Company Links
      linkedinUrl: company?.companyLinks?.linkedin || '',
      glassdoorUrl: company?.companyLinks?.glassdoor || '',
      careersUrl: company?.companyLinks?.careers || '',
      newsUrl: company?.companyLinks?.news || '',
      // Ratings
      overallRating: company?.ratings?.overall || undefined,
      workLifeBalanceRating: company?.ratings?.workLifeBalance || undefined,
      compensationRating: company?.ratings?.compensation || undefined,
      careerGrowthRating: company?.ratings?.careerGrowth || undefined,
      managementRating: company?.ratings?.management || undefined,
      cultureRating: company?.ratings?.culture || undefined,
      // Salary
      salaryMin: company?.salaryRange?.min || undefined,
      salaryMax: company?.salaryRange?.max || undefined,
      salaryCurrency: company?.salaryRange?.currency || 'USD',
      salaryPeriod: 'year',
    },
  });

  const handleSubmit = (values: CompanyFormValues) => {
    // Transform form values to Company format
    const companyData: Partial<Company> = {
      name: values.name,
      website: values.website || undefined,
      industry: values.industry ? [values.industry] : undefined,
      size: values.size || undefined,
      location: values.location || undefined,
      founded: values.founded || undefined,
      remotePolicy: (values.remotePolicy as Company['remotePolicy']) || undefined,
      status: (values.status as Company['status']) || undefined,
      priority: (values.priority as Company['priority']) || undefined,
      researched: values.researched || false,
      description: values.description || undefined,
      culture: values.culture || undefined,
      techStack: values.techStack
        ? values.techStack
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      benefits: values.benefits
        ? values.benefits
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      pros: values.pros
        ? values.pros
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      cons: values.cons
        ? values.cons
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      notes: values.notes || undefined,
      // Company Links
      companyLinks: {
        website: values.website || undefined,
        linkedin: values.linkedinUrl || undefined,
        glassdoor: values.glassdoorUrl || undefined,
        careers: values.careersUrl || undefined,
        news: values.newsUrl || undefined,
      },
      // Ratings
      ratings: {
        overall: values.overallRating || undefined,
        workLifeBalance: values.workLifeBalanceRating || undefined,
        compensation: values.compensationRating || undefined,
        careerGrowth: values.careerGrowthRating || undefined,
        management: values.managementRating || undefined,
        culture: values.cultureRating || undefined,
      },
      // Salary Range
      salaryRange: values.salaryMin || values.salaryMax ? {
        min: values.salaryMin,
        max: values.salaryMax,
        currency: values.salaryCurrency || 'USD',
      } : undefined,
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
                <FormDescription>Headquarters or main office location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="founded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founded</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2010" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_STATUSES.map((status) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="remotePolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remote Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select remote policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REMOTE_POLICIES.map((policy) => (
                        <SelectItem key={policy.value} value={policy.value}>
                          {policy.icon} {policy.label}
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
              name="researched"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Researched</FormLabel>
                    <FormDescription>
                      Mark if you've completed research on this company
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.linkedin.com/company/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="glassdoorUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glassdoor URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.glassdoor.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careersUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Careers Page URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://company.com/careers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>News/Blog URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://company.com/blog" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ratings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workLifeBalanceRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work-Life Balance</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compensationRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compensation</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerGrowthRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Growth</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managementRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cultureRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Culture</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      placeholder="0-5" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Salary Range</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="50000" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
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
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="100000" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.value}
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
                <FormDescription>Comma-separated list of technologies</FormDescription>
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
                <FormDescription>Comma-separated list of benefits and perks</FormDescription>
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
                  <Input
                    placeholder="Great culture, Competitive salary, Growth opportunities"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Comma-separated list of positive aspects</FormDescription>
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
                  <Input
                    placeholder="Long commute, Startup uncertainty, Limited benefits"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Comma-separated list of concerns or drawbacks</FormDescription>
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
