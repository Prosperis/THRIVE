import { useMemo, useState, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { SortableHeader } from '@/components/ui/sortable-header';
import { BulkActions } from './BulkActions';
import { ApplicationDialog } from './ApplicationDialog';
import { useApplicationsStore } from '@/stores';
import type { Application } from '@/types';
import { formatDate } from '@/lib/utils';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

const statusColors: Record<Application['status'], string> = {
  target: 'bg-gray-500',
  hunting: 'bg-blue-500',
  applied: 'bg-yellow-500',
  interviewing: 'bg-purple-500',
  offer: 'bg-green-500',
  accepted: 'bg-emerald-500',
  rejected: 'bg-red-500',
  withdrawn: 'bg-orange-500',
};

const priorityColors: Record<NonNullable<Application['priority']>, string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
};

export function ApplicationsTable() {
  const { getFilteredApplications, deleteApplication } = useApplicationsStore();
  const applications = getFilteredApplications();
  const [editingApplication, setEditingApplication] = useState<Application | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = useCallback((application: Application) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    // Small delay before clearing to avoid visual glitches
    setTimeout(() => setEditingApplication(undefined), 200);
  }, []);

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'position',
        header: ({ column }) => (
          <SortableHeader column={column}>Position</SortableHeader>
        ),
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">{row.getValue('position')}</div>
              <div className="text-sm text-muted-foreground">{row.original.companyName}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'companyName',
        header: ({ column }) => (
          <SortableHeader column={column}>Company</SortableHeader>
        ),
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue('companyName')}</div>;
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <SortableHeader column={column}>Status</SortableHeader>
        ),
        cell: ({ row }) => {
          const status = row.getValue('status') as Application['status'];
          return (
            <Badge className={statusColors[status]}>
              {status.replace('-', ' ')}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => (
          <SortableHeader column={column}>Priority</SortableHeader>
        ),
        cell: ({ row }) => {
          const priority = row.getValue('priority') as Application['priority'];
          if (!priority) return <span className="text-muted-foreground">-</span>;
          return (
            <Badge className={priorityColors[priority]} variant="outline">
              {priority}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          const workType = row.original.workType;
          const location = row.getValue('location') as string;
          return (
            <div>
              <div>{location || 'Not specified'}</div>
              <div className="text-sm text-muted-foreground capitalize">{workType}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'salary.min',
        id: 'salary',
        header: ({ column }) => (
          <SortableHeader column={column}>Salary</SortableHeader>
        ),
        cell: ({ row }) => {
          const salary = row.original.salary;
          if (!salary?.min && !salary?.max) return <span className="text-muted-foreground">N/A</span>;
          
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: salary?.currency || 'USD',
            maximumFractionDigits: 0,
          });
          
          if (salary?.min && salary?.max) {
            return (
              <div>
                <div>{formatter.format(salary.min)} - {formatter.format(salary.max)}</div>
                {salary.period && (
                  <div className="text-sm text-muted-foreground">per {salary.period}</div>
                )}
              </div>
            );
          }
          
          return <span>{formatter.format(salary?.min || salary?.max || 0)}</span>;
        },
      },
      {
        accessorKey: 'appliedDate',
        header: ({ column }) => (
          <SortableHeader column={column}>Applied</SortableHeader>
        ),
        cell: ({ row }) => {
          const date = row.getValue('appliedDate') as Date | undefined;
          return date ? formatDate(date) : <span className="text-muted-foreground">Not applied</span>;
        },
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <SortableHeader column={column}>Updated</SortableHeader>
        ),
        cell: ({ row }) => {
          return formatDate(row.getValue('updatedAt'));
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const application = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(application.id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(application)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteApplication(application.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteApplication, handleEdit]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={applications}
        searchKey="position"
        searchPlaceholder="Search positions..."
        storageKey="thrive-applications-table"
        renderBulkActions={({ selectedRows, table }) => (
          <BulkActions
            selectedRows={selectedRows}
            onClearSelection={() => table.resetRowSelection()}
          />
        )}
      />
      
      <ApplicationDialog
        application={editingApplication}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
      />
    </>
  );
}
