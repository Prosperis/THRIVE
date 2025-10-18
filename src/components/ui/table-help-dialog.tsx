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
import { HelpCircle } from 'lucide-react';

export function TableHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Table Features & Tips</DialogTitle>
          <DialogDescription>
            Learn how to get the most out of your application tracking
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">🔄 Sorting</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Click any column header to sort ascending (A→Z, 0→9)</li>
              <li>• Click again to sort descending (Z→A, 9→0)</li>
              <li>• Click once more to clear the sort</li>
              <li>• Hold <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs">Shift</kbd> while clicking to add multi-column sorts</li>
              <li>• Sort preferences are saved automatically</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">☑️ Selection & Bulk Actions</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Check boxes to select individual rows</li>
              <li>• Check header box to select all rows on current page</li>
              <li>• Selected rows reveal bulk action toolbar</li>
              <li>• Bulk update status or priority for multiple applications</li>
              <li>• Export selected rows to CSV format</li>
              <li>• Delete multiple applications with confirmation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">🔍 Search & Filters</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use search box for instant text filtering (300ms debounce)</li>
              <li>• Apply multiple filters for precise criteria</li>
              <li>• Save frequently used filter combinations</li>
              <li>• Filter by status, priority, work type, and dates</li>
              <li>• Filters persist across sessions in local storage</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">⌨️ Keyboard Shortcuts</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs">Shift</kbd> + Click: Multi-column sort</li>
              <li>• <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs">Enter</kbd>: Save filter name in dialogs</li>
              <li>• <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs">Esc</kbd>: Close dialogs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">💾 Data Persistence</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Sort preferences saved in local storage</li>
              <li>• Saved filters stored locally for quick access</li>
              <li>• All settings restore automatically on reload</li>
              <li>• Data stored in IndexedDB for offline access</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
