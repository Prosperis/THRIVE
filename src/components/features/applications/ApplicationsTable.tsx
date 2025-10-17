import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { useApplicationsStore } from '@/stores';
import type { Application } from '@/types';
import { formatDate } from '@/lib/utils';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

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
  const { applications, deleteApplication } = useApplicationsStore();

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'position',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Position
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
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
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Priority
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
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
        accessorKey: 'salary',
        header: 'Salary',
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Applied
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue('appliedDate') as Date | undefined;
          return date ? formatDate(date) : <span className="text-muted-foreground">Not applied</span>;
        },
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Updated
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
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
                <DropdownMenuItem>
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
    [deleteApplication]
  );

  return (
    <DataTable
      columns={columns}
      data={applications}
      searchKey="position"
      searchPlaceholder="Search positions..."
    />
  );
}
