import { useState, useMemo } from 'react';
import { Link2, Briefcase, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { Company } from '@/types';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useCompaniesStore } from '@/stores/companiesStore';

interface LinkApplicationDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkApplicationDialog({ company, open, onOpenChange }: LinkApplicationDialogProps) {
  const { applications } = useApplicationsStore();
  const { updateCompany } = useCompaniesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // Filter applications that could be linked
  const availableApplications = useMemo(() => {
    return applications.filter(app => {
      // Already linked to this company
      if (company.applicationIds.includes(app.id)) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.position.toLowerCase().includes(query) ||
          app.companyName.toLowerCase().includes(query) ||
          app.location?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [applications, company.applicationIds, searchQuery]);

  // Currently linked applications
  const linkedApplications = useMemo(() => {
    return applications.filter(app => company.applicationIds.includes(app.id));
  }, [applications, company.applicationIds]);

  const handleLink = () => {
    if (selectedAppIds.length === 0) {
      toast.error('Please select at least one application');
      return;
    }

    // Update company with new application IDs
    const updatedApplicationIds = [...company.applicationIds, ...selectedAppIds];
    updateCompany(company.id, { applicationIds: updatedApplicationIds });

    toast.success(
      `Linked ${selectedAppIds.length} ${selectedAppIds.length === 1 ? 'application' : 'applications'} to ${company.name}`
    );

    setSelectedAppIds([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  const handleUnlink = (appId: string) => {
    const updatedApplicationIds = company.applicationIds.filter(id => id !== appId);
    updateCompany(company.id, { applicationIds: updatedApplicationIds });
    toast.success('Application unlinked');
  };

  const toggleSelection = (appId: string) => {
    setSelectedAppIds(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Link Applications to {company.name}
          </DialogTitle>
          <DialogDescription>
            Connect applications to this company for better tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Currently Linked */}
          {linkedApplications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">
                Linked Applications ({linkedApplications.length})
              </h3>
              <div className="space-y-2">
                {linkedApplications.map(app => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{app.position}</span>
                        <Badge variant="outline" className="text-xs">
                          {app.status}
                        </Badge>
                      </div>
                      {app.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.location}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlink(app.id)}
                    >
                      Unlink
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Link New */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Link New Applications</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Available Applications */}
            <ScrollArea className="h-[300px] border rounded-lg">
              {availableApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <Briefcase className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No applications found' : 'No more applications to link'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {availableApplications.map(app => (
                    <label
                      key={app.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      htmlFor={`app-${app.id}`}
                    >
                      <Checkbox
                        id={`app-${app.id}`}
                        checked={selectedAppIds.includes(app.id)}
                        onCheckedChange={() => toggleSelection(app.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{app.position}</span>
                          <Badge variant="outline" className="text-xs">
                            {app.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                          <div>{app.companyName}</div>
                          {app.location && <div>{app.location}</div>}
                          {app.appliedDate && (
                            <div>
                              Applied {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>

            {selectedAppIds.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedAppIds.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAppIds([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={selectedAppIds.length === 0}>
            <Link2 className="h-4 w-4 mr-2" />
            Link {selectedAppIds.length > 0 && `(${selectedAppIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
