import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Calendar,
  Briefcase,
  FileText,
  Star,
  Edit,
  ExternalLink,
  Trash2,
  Link2,
} from 'lucide-react';
import type { Company } from '@/types';
import { COMPANY_STATUSES, REMOTE_POLICIES, PRIORITY_LEVELS } from '@/lib/constants';
import { CompanyDialog } from './CompanyDialog';
import { LinkApplicationDialog } from './LinkApplicationDialog';
import { useApplicationsStore } from '@/stores/applicationsStore';

interface CompanyDetailDrawerProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (company: Company) => void;
}

export function CompanyDetailDrawer({ company, open, onOpenChange, onDelete }: CompanyDetailDrawerProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const { applications } = useApplicationsStore();

  if (!company) return null;

  // Find linked applications - use applicationIds from company
  const linkedApplications = applications.filter(app => company.applicationIds.includes(app.id));

  // Get status badge
  const status = COMPANY_STATUSES.find(s => s.value === company.status);
  const remotePolicy = REMOTE_POLICIES.find(p => p.value === company.remotePolicy);
  const priority = PRIORITY_LEVELS.find(p => p.value === company.priority);

  // Calculate completeness
  const totalFields = 15;
  const filledFields = [
    company.website,
    company.industry?.length,
    company.size,
    company.location,
    company.description,
    company.culture,
    company.techStack?.length,
    company.benefits?.length,
    company.companyLinks?.linkedin,
    company.companyLinks?.glassdoor,
    company.ratings?.overall,
    company.salaryRange?.min,
    company.pros?.length,
    company.cons?.length,
    company.notes,
  ].filter(Boolean).length;
  const completeness = Math.round((filledFields / totalFields) * 100);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      onDelete?.(company);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  {company.name}
                </SheetTitle>
                <SheetDescription className="mt-2 space-y-2">
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {company.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </SheetDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Badges and metadata */}
            <div className="flex flex-wrap gap-2 pt-4">
              {status && (
                <Badge variant="outline" className="gap-1">
                  {status.label}
                </Badge>
              )}
              {priority && (
                <Badge variant="outline" className="gap-1">
                  {priority.label}
                </Badge>
              )}
              {remotePolicy && (
                <Badge variant="outline" className="gap-1">
                  {remotePolicy.icon} {remotePolicy.label}
                </Badge>
              )}
              {company.researched && (
                <Badge variant="default">Researched</Badge>
              )}
              <Badge variant="secondary">
                {completeness}% Complete
              </Badge>
            </div>
          </SheetHeader>

          <Separator className="my-6" />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="applications">
                Apps ({linkedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {company.industry && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Industry</div>
                    <div className="font-medium">{company.industry.join(', ')}</div>
                  </div>
                )}
                {company.size && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Company Size</div>
                    <div className="font-medium">{company.size}</div>
                  </div>
                )}
                {company.founded && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Founded
                    </div>
                    <div className="font-medium">{company.founded}</div>
                  </div>
                )}
                {company.salaryRange && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Salary Range</div>
                    <div className="font-medium">
                      {company.salaryRange.currency} {company.salaryRange.min?.toLocaleString()} - {company.salaryRange.max?.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {company.ratings?.overall && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Ratings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (company.ratings?.overall || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">
                          {company.ratings.overall.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {company.ratings.workLifeBalance && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Work-Life Balance</span>
                        <span>{company.ratings.workLifeBalance.toFixed(1)}</span>
                      </div>
                    )}
                    {company.ratings.compensation && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Compensation</span>
                        <span>{company.ratings.compensation.toFixed(1)}</span>
                      </div>
                    )}
                    {company.ratings.careerGrowth && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Career Growth</span>
                        <span>{company.ratings.careerGrowth.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {company.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {company.description}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research" className="space-y-6 mt-6">
              {/* Culture */}
              {company.culture && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Culture</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {company.culture}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {company.techStack && company.techStack.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {company.benefits && company.benefits.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline">{benefit}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.pros && company.pros.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">Pros</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      {company.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {company.cons && company.cons.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-600">Cons</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      {company.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Notes */}
              {company.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {company.notes}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {linkedApplications.length} {linkedApplications.length === 1 ? 'application' : 'applications'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLinkDialogOpen(true)}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Link Application
                </Button>
              </div>

              {linkedApplications.length > 0 ? (
                <div className="space-y-3">
                  {linkedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{app.position}</h4>
                          <p className="text-sm text-muted-foreground">
                            {app.appliedDate && `Applied ${new Date(app.appliedDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <Badge>{app.status}</Badge>
                      </div>
                      {app.salary && (
                        <p className="text-sm">
                          {app.salary.currency} {app.salary.min?.toLocaleString()} - {app.salary.max?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No linked applications yet</p>
                  <p className="text-xs mt-1">Click the button above to link existing applications</p>
                </div>
              )}
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-4 mt-6">
              {company.companyLinks && (
                <div className="space-y-3">
                  {company.companyLinks.linkedin && (
                    <a
                      href={company.companyLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-sm text-muted-foreground">
                          {company.companyLinks.linkedin}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {company.companyLinks.glassdoor && (
                    <a
                      href={company.companyLinks.glassdoor}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Glassdoor</div>
                        <div className="text-sm text-muted-foreground">
                          {company.companyLinks.glassdoor}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {company.companyLinks.careers && (
                    <a
                      href={company.companyLinks.careers}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Careers Page</div>
                        <div className="text-sm text-muted-foreground">
                          {company.companyLinks.careers}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {company.companyLinks.news && (
                    <a
                      href={company.companyLinks.news}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">News/Blog</div>
                        <div className="text-sm text-muted-foreground">
                          {company.companyLinks.news}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <CompanyDialog
        company={company}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Link Application Dialog */}
      <LinkApplicationDialog
        company={company}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />
    </>
  );
}
