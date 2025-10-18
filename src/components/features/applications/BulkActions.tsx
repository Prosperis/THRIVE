import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useApplicationsStore } from '@/stores';
import type { Application, ApplicationStatus } from '@/types';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { Trash2, Download, Edit, ChevronDown } from 'lucide-react';

interface BulkActionsProps {
  selectedRows: Application[];
  onClearSelection: () => void;
}

export function BulkActions({ selectedRows, onClearSelection }: BulkActionsProps) {
  const { updateApplication, deleteApplication } = useApplicationsStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = selectedRows.length;

  // Bulk delete handler
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedRows.map((row) => deleteApplication(row.id))
      );
      onClearSelection();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting applications:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk status update handler
  const handleBulkStatusUpdate = async (status: ApplicationStatus) => {
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedRows.map((row) => updateApplication(row.id, { status }))
      );
      onClearSelection();
    } catch (error) {
      console.error('Error updating applications:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Export to CSV handler
  const handleExportToCSV = () => {
    // Prepare CSV data
    const headers = [
      'Position',
      'Company',
      'Status',
      'Priority',
      'Work Type',
      'Location',
      'Salary Min',
      'Salary Max',
      'Currency',
      'Applied Date',
      'Target Date',
      'Updated At',
      'Notes',
      'Tags',
    ];

    const rows = selectedRows.map((app) => [
      app.position,
      app.companyName,
      app.status,
      app.priority || '',
      app.workType || '',
      app.location || '',
      app.salary?.min?.toString() || '',
      app.salary?.max?.toString() || '',
      app.salary?.currency || '',
      app.appliedDate ? new Date(app.appliedDate).toISOString().split('T')[0] : '',
      app.targetDate ? new Date(app.targetDate).toISOString().split('T')[0] : '',
      new Date(app.updatedAt).toISOString().split('T')[0],
      app.notes || '',
      app.tags?.join('; ') || '',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Badge variant="secondary" className="text-sm">
          {selectedCount} selected
        </Badge>

        {/* Bulk Status Update */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <Edit className="mr-2 h-4 w-4" />
              Update Status
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Change status to:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {APPLICATION_STATUSES.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleBulkStatusUpdate(status.value)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-${status.color}-500`}
                  />
                  <span>{status.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export to CSV */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToCSV}
          disabled={isProcessing}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

        {/* Bulk Delete */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isProcessing}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          Clear
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCount} application{selectedCount > 1 ? 's' : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
