/**
 * Batched Tag Input Example
 * 
 * This example shows how to wrap the existing TagInput component
 * with database batching to reduce writes during rapid tag editing.
 * 
 * Use this pattern when tags are stored directly in the database
 * and you want to batch multiple rapid edits together.
 */

import { useState, useEffect } from 'react';
import { TagInput } from '@/components/ui/tag-input';
import { useDatabaseBatcher } from '@/hooks/useDatabaseBatching';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import type { Table } from 'dexie';

interface BatchedTagInputProps {
  /** The ID of the record being edited */
  recordId: string;
  /** Initial tags value */
  initialTags: string;
  /** The Dexie table to update (e.g., db.applications, db.companies) */
  // biome-ignore lint/suspicious/noExplicitAny: Generic table type for flexibility
  table: Table<any>;
  /** Optional callback when tags are saved */
  onSave?: () => void;
}

/**
 * Example 1: Basic Batched Tag Input
 * 
 * Wraps TagInput with database batching. Multiple rapid tag changes
 * are grouped together and written to the database in one operation.
 */
export function BatchedTagInput({
  recordId,
  initialTags,
  table,
  onSave,
}: BatchedTagInputProps) {
  const [tags, setTags] = useState(initialTags);

  // Create a batcher that waits 500ms after the last change
  const batcher = useDatabaseBatcher({
    table,
    wait: 500,
    maxBatchSize: 10,
    onSuccess: () => {
      toast.success('Tags saved');
      onSave?.();
    },
    onError: (error) => {
      console.error('Failed to save tags:', error);
      toast.error('Failed to save tags');
    },
  });

  const handleTagsChange = (newTags: string) => {
    setTags(newTags);
    // Queue the update - will be batched automatically
    batcher.update(recordId, { tags: newTags });
  };

  return (
    <TagInput
      value={tags}
      onChange={handleTagsChange}
      placeholder="Add tags..."
    />
  );
}

/**
 * Example 2: Application Tags with Batching
 * 
 * Specific implementation for application tags.
 */
interface ApplicationTagsProps {
  applicationId: string;
  initialTags: string;
}

export function ApplicationTagsBatched({
  applicationId,
  initialTags,
}: ApplicationTagsProps) {
  const [tags, setTags] = useState(initialTags);

  const batcher = useDatabaseBatcher({
    table: db.applications,
    wait: 500, // Wait 500ms after last edit
    maxBatchSize: 10, // Or flush after 10 updates
    onSuccess: (count) => {
      console.log(`Saved ${count} tag changes`);
    },
  });

  const handleChange = (newTags: string) => {
    setTags(newTags);
    // Convert string to array for database storage
    const tagsArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);
    batcher.update(applicationId, { tags: tagsArray });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Tags</div>
      <TagInput value={tags} onChange={handleChange} />
      <p className="text-xs text-muted-foreground">
        Changes are auto-saved after you finish editing
      </p>
    </div>
  );
}

/**
 * Example 3: Using useAutoSaveBatcher for Simpler Code
 * 
 * useAutoSaveBatcher automatically batches whenever the value changes.
 */
import { useAutoSaveBatcher } from '@/hooks/useDatabaseBatching';

export function ApplicationTagsAutoSave({
  applicationId,
  initialTags,
}: ApplicationTagsProps) {
  const [tags, setTags] = useState(initialTags);

  // Convert tags to array for database
  const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

  // Automatically batch and save whenever tags change
  useAutoSaveBatcher(
    db.applications,
    applicationId,
    { tags: tagsArray },
    [tags], // Dependencies - save when tags change
    {
      wait: 500,
      onSuccess: () => console.log('Tags auto-saved'),
    }
  );

  return (
    <TagInput
      value={tags}
      onChange={setTags}
      placeholder="Add tags (auto-saves)..."
    />
  );
}

/**
 * Example 4: Real-world Integration
 * 
 * Shows how to integrate batched tags in an application form.
 */
import type { Application } from '@/types';

interface ApplicationFormProps {
  applicationId: string;
}

export function ApplicationFormWithBatchedTags({ applicationId }: ApplicationFormProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load application data
  useEffect(() => {
    const loadApplication = async () => {
      const app = await db.applications.get(applicationId);
      setApplication(app || null);
      setIsLoading(false);
    };
    loadApplication();
  }, [applicationId]);

  if (isLoading || !application) {
    return <div>Loading...</div>;
  }

  const tagsString = Array.isArray(application.tags) 
    ? application.tags.join(', ') 
    : application.tags || '';

  return (
    <div className="space-y-4">
      {/* Other form fields... */}
      
      <div>
        <div className="text-sm font-medium mb-2">Company Tags</div>
        <BatchedTagInput
          recordId={applicationId}
          initialTags={tagsString}
          table={db.applications}
        />
      </div>

      {/* More form fields... */}
    </div>
  );
}

/**
 * Performance Comparison
 * ======================
 * 
 * WITHOUT BATCHING:
 * - User adds 5 tags rapidly
 * - Result: 5 database write operations
 * - Time: ~250ms (5 × 50ms)
 * 
 * WITH BATCHING:
 * - User adds 5 tags rapidly
 * - Result: 1 batched database operation (after 500ms)
 * - Time: ~50ms
 * - Improvement: 80% fewer operations, 80% less time
 * 
 * BENEFITS:
 * ✅ Reduced database load
 * ✅ Better performance on slow devices
 * ✅ Prevents IndexedDB throttling
 * ✅ Smoother UX (no lag from writes)
 * ✅ Automatic cleanup on unmount
 */

/**
 * Migration Guide
 * ===============
 * 
 * To migrate an existing TagInput to use batching:
 * 
 * 1. Wrap your component with batching hook:
 *    const batcher = useDatabaseBatcher({ table, wait: 500 });
 * 
 * 2. Replace direct database calls with batcher:
 *    // Before: db.table.update(id, { tags })
 *    // After:  batcher.update(id, { tags })
 * 
 * 3. Remove async/await (batching handles it):
 *    // Before: await db.table.update(...)
 *    // After:  batcher.update(...)
 * 
 * 4. Add success/error callbacks for feedback:
 *    onSuccess: () => toast.success('Saved'),
 *    onError: (e) => toast.error('Failed'),
 */
