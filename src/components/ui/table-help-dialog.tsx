import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Tips</DialogTitle>
          <DialogDescription>Power features you might not know about</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1.5 flex items-center gap-2">
              ⌨️ Keyboard Shortcuts
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs font-mono">
                  Shift
                </kbd>
                + Click header: Multi-column sort
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs font-mono">
                  Enter
                </kbd>
                Save filter name
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground text-xs font-mono">
                  Esc
                </kbd>
                Close dialogs
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1.5 flex items-center gap-2">🎯 Pro Tips</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Right-click rows for quick actions</li>
              <li>• Save filter combinations for reuse</li>
              <li>• Bulk actions appear when rows selected</li>
              <li>• Drag documents onto rows to link them</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
