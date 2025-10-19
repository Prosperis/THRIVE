import { Plus, Search, Tag as TagIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTagStore } from '@/stores/tagStore';

interface TagSelectorProps {
  entityId: string;
  className?: string;
  showLabel?: boolean;
}

export function TagSelector({ entityId, className, showLabel = true }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tags = useTagStore((state) => state.tags);
  const entityTags = useTagStore((state) => state.getEntityTags(entityId));
  const tagEntity = useTagStore((state) => state.tagEntity);
  const untagEntity = useTagStore((state) => state.untagEntity);
  const addTag = useTagStore((state) => state.addTag);
  const searchTags = useTagStore((state) => state.searchTags);

  const selectedTagIds = new Set(entityTags.map((tag) => tag.id));

  // Filter tags based on search
  const filteredTags = searchQuery ? searchTags(searchQuery) : tags;
  const availableTags = filteredTags.filter((tag) => !selectedTagIds.has(tag.id));

  const handleAddTag = (tagId: string) => {
    tagEntity(entityId, tagId);
  };

  const handleRemoveTag = (tagId: string) => {
    untagEntity(entityId, tagId);
  };

  const handleCreateTag = () => {
    if (searchQuery.trim()) {
      const newTag = addTag({
        name: searchQuery.trim(),
        category: 'custom',
      });
      tagEntity(entityId, newTag.id);
      setSearchQuery('');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <TagIcon className="h-4 w-4" />
          Tags
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {/* Display selected tags */}
        {entityTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="gap-1"
            style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Add tag button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                  placeholder="Search or create tag..."
                  className="pl-8"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {availableTags.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchQuery ? (
                    <div className="space-y-2">
                      <p>No tags found</p>
                      <Button size="sm" onClick={handleCreateTag}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create "{searchQuery}"
                      </Button>
                    </div>
                  ) : (
                    <p>All tags are already added</p>
                  )}
                </div>
              )}

              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    handleAddTag(tag.id);
                    setSearchQuery('');
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {tag.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                    <span className="text-sm font-medium">{tag.name}</span>
                  </div>
                  {tag.usageCount > 0 && (
                    <span className="text-xs text-muted-foreground">{tag.usageCount}</span>
                  )}
                </button>
              ))}
            </div>

            {searchQuery && availableTags.length > 0 && (
              <div className="p-2 border-t">
                <Button size="sm" className="w-full" onClick={handleCreateTag}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchQuery}"
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
