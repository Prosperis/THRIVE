import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookmarkPlus, Bookmark, Trash2, Check } from 'lucide-react';
import { useSavedFilters } from '@/hooks/useSavedFilters';
import type { ApplicationFilters, InterviewFilters } from '@/types';

interface SavedFiltersDialogProps {
  filterType: 'applications' | 'interviews';
  currentFilters: ApplicationFilters | InterviewFilters;
  onLoadFilter: (filters: ApplicationFilters | InterviewFilters) => void;
  trigger?: React.ReactNode;
}

export function SavedFiltersDialog({
  filterType,
  currentFilters,
  onLoadFilter,
  trigger,
}: SavedFiltersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { savedFilters, saveFilter, deleteFilter, getFilterLabel } = useSavedFilters(filterType);

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    setIsSaving(true);
    saveFilter(filterName.trim(), currentFilters);
    setFilterName('');
    setIsSaving(false);
  };

  const handleLoadFilter = (filters: ApplicationFilters | InterviewFilters) => {
    onLoadFilter(filters);
    setIsOpen(false);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Filters
            {savedFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5">
                {savedFilters.length}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Saved Filters</DialogTitle>
          <DialogDescription>
            Save your current filter settings or load a previously saved filter combination.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Save Current Filters */}
          {hasActiveFilters && (
            <div className="space-y-3 pb-4 border-b">
              <h3 className="text-sm font-medium">Save Current Filters</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="filter-name" className="sr-only">
                    Filter Name
                  </Label>
                  <Input
                    id="filter-name"
                    placeholder="Enter filter name..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveFilter();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim() || isSaving}
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Active filters: {getFilterLabel(currentFilters)}
              </div>
            </div>
          )}

          {/* Saved Filters List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              Saved Filters ({savedFilters.length})
            </h3>
            
            {savedFilters.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {hasActiveFilters ? (
                  <>
                    <p className="mb-2">No saved filters yet.</p>
                    <p>Save your current filters to quickly access them later.</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">No saved filters yet.</p>
                    <p>Apply some filters, then save them for quick access.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {savedFilters.map((savedFilter) => (
                  <div
                    key={savedFilter.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {savedFilter.name}
                        </h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {new Date(savedFilter.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {getFilterLabel(savedFilter.filters)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadFilter(savedFilter.filters)}
                        className="h-8 px-2"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteFilter(savedFilter.id)}
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {!hasActiveFilters && savedFilters.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Apply some filters to save a new filter combination
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
