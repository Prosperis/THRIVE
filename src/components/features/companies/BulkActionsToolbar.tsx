import { useState } from 'react';
import { Trash2, Tag, Flag, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Company } from '@/types';
import { useCompaniesStore } from '@/stores/companiesStore';
import { COMPANY_STATUSES, PRIORITY_LEVELS } from '@/lib/constants';

interface BulkActionsToolbarProps {
  selectedCompanies: Company[];
  onClearSelection: () => void;
}

export function BulkActionsToolbar({ selectedCompanies, onClearSelection }: BulkActionsToolbarProps) {
  const { updateCompany, deleteCompany } = useCompaniesStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateField, setUpdateField] = useState<'status' | 'priority' | 'researched'>('status');
  const [newValue, setNewValue] = useState<string>('');

  const selectedCount = selectedCompanies.length;

  // Bulk delete
  const handleBulkDelete = () => {
    selectedCompanies.forEach(company => {
      deleteCompany(company.id);
    });
    toast.success(`Deleted ${selectedCount} ${selectedCount === 1 ? 'company' : 'companies'}`);
    setDeleteDialogOpen(false);
    onClearSelection();
  };

  // Bulk update
  const handleBulkUpdate = () => {
    if (!newValue && updateField !== 'researched') {
      toast.error('Please select a value');
      return;
    }

    selectedCompanies.forEach(company => {
      const updates: Partial<Company> = {};
      
      if (updateField === 'status') {
        updates.status = newValue as Company['status'];
      } else if (updateField === 'priority') {
        updates.priority = newValue as Company['priority'];
      } else if (updateField === 'researched') {
        updates.researched = true;
      }

      updateCompany(company.id, updates);
    });

    const fieldLabel = updateField === 'researched' ? 'marked as researched' : `${updateField} updated`;
    toast.success(`${selectedCount} ${selectedCount === 1 ? 'company' : 'companies'} ${fieldLabel}`);
    setUpdateDialogOpen(false);
    setNewValue('');
    onClearSelection();
  };

  const openUpdateDialog = (field: 'status' | 'priority' | 'researched') => {
    setUpdateField(field);
    setNewValue('');
    setUpdateDialogOpen(true);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/50 border-b">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openUpdateDialog('status')}
          >
            <Tag className="h-4 w-4 mr-2" />
            Update Status
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openUpdateDialog('priority')}
          >
            <Flag className="h-4 w-4 mr-2" />
            Update Priority
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openUpdateDialog('researched')}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Researched
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedCount} {selectedCount === 1 ? 'Company' : 'Companies'}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount === 1 ? 'this company' : 'these companies'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedCount <= 5 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Companies to delete:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {selectedCompanies.map(company => (
                  <li key={company.id}>{company.name}</li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedCount === 1 ? 'Company' : 'Companies'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update {selectedCount} {selectedCount === 1 ? 'Company' : 'Companies'}
            </DialogTitle>
            <DialogDescription>
              {updateField === 'researched' 
                ? `Mark ${selectedCount === 1 ? 'this company' : 'these companies'} as researched?`
                : `Select a new ${updateField} for ${selectedCount === 1 ? 'this company' : 'these companies'}`
              }
            </DialogDescription>
          </DialogHeader>

          {updateField !== 'researched' && (
            <div className="space-y-4">
              {updateField === 'status' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <Select value={newValue} onValueChange={setNewValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {updateField === 'priority' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Priority</div>
                  <Select value={newValue} onValueChange={setNewValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update {selectedCount === 1 ? 'Company' : 'Companies'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
