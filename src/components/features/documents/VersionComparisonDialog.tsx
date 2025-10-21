import { X, GitCompare, Clock } from 'lucide-react';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Document } from '@/types';

interface VersionComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDocument: Document;
  linkedVersion: number;
  linkedContent?: string;
}

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'modified';
  oldLine?: string;
  newLine?: string;
  lineNumber: number;
}

export function VersionComparisonDialog({
  open,
  onOpenChange,
  currentDocument,
  linkedVersion,
  linkedContent,
}: VersionComparisonDialogProps) {
  // Simple line-based diff algorithm
  const diffLines = useMemo(() => {
    const oldContent = linkedContent || '';
    const newContent = currentDocument.content || '';
    
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const maxLines = Math.max(oldLines.length, newLines.length);
    const diffs: DiffLine[] = [];
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      if (oldLine === undefined && newLine !== undefined) {
        // Line was added
        diffs.push({
          type: 'added',
          newLine,
          lineNumber: i + 1,
        });
      } else if (oldLine !== undefined && newLine === undefined) {
        // Line was removed
        diffs.push({
          type: 'removed',
          oldLine,
          lineNumber: i + 1,
        });
      } else if (oldLine !== newLine) {
        // Line was modified
        diffs.push({
          type: 'modified',
          oldLine,
          newLine,
          lineNumber: i + 1,
        });
      } else {
        // Line is the same
        diffs.push({
          type: 'same',
          oldLine,
          newLine,
          lineNumber: i + 1,
        });
      }
    }
    
    return diffs;
  }, [linkedContent, currentDocument.content]);

  const stats = useMemo(() => {
    const added = diffLines.filter((d) => d.type === 'added').length;
    const removed = diffLines.filter((d) => d.type === 'removed').length;
    const modified = diffLines.filter((d) => d.type === 'modified').length;
    
    return { added, removed, modified };
  }, [diffLines]);

  const getLineClassName = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-950/30 border-l-2 border-green-500';
      case 'removed':
        return 'bg-red-50 dark:bg-red-950/30 border-l-2 border-red-500';
      case 'modified':
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-l-2 border-yellow-500';
      default:
        return 'bg-background';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0 animate-scaleIn">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="h-5 w-5 text-muted-foreground" />
              <div>
                <DialogTitle className="text-lg">Version Comparison</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentDocument.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Version badges and stats */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Linked: v{linkedVersion}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Current: v{currentDocument.version}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-xs ml-auto">
              {stats.added > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {stats.added} added
                </span>
              )}
              {stats.removed > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {stats.removed} removed
                </span>
              )}
              {stats.modified > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  {stats.modified} modified
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-border h-full">
            {/* Left side - Linked Version */}
            <div className="flex flex-col bg-background">
              <div className="px-4 py-2 border-b bg-muted/30">
                <h3 className="text-sm font-medium">
                  Linked Version (v{linkedVersion})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Version used in this application
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="font-mono text-xs">
                  {diffLines.map((diff, idx) => (
                    <div
                      key={`old-${idx}`}
                      className={`px-4 py-1 ${getLineClassName(diff.type)}`}
                    >
                      <span className="inline-block w-10 text-muted-foreground select-none">
                        {diff.type !== 'added' ? diff.lineNumber : ''}
                      </span>
                      <span className="whitespace-pre-wrap break-words">
                        {diff.type === 'added' ? '' : diff.oldLine || '\u00A0'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right side - Current Version */}
            <div className="flex flex-col bg-background">
              <div className="px-4 py-2 border-b bg-muted/30">
                <h3 className="text-sm font-medium">
                  Current Version (v{currentDocument.version})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Latest version of the document
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="font-mono text-xs">
                  {diffLines.map((diff, idx) => (
                    <div
                      key={`new-${idx}`}
                      className={`px-4 py-1 ${getLineClassName(diff.type)}`}
                    >
                      <span className="inline-block w-10 text-muted-foreground select-none">
                        {diff.type !== 'removed' ? diff.lineNumber : ''}
                      </span>
                      <span className="whitespace-pre-wrap break-words">
                        {diff.type === 'removed' ? '' : diff.newLine || '\u00A0'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border-l-2 border-green-500 bg-green-50 dark:bg-green-950/30" />
                Added lines
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border-l-2 border-red-500 bg-red-50 dark:bg-red-950/30" />
                Removed lines
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border-l-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30" />
                Modified lines
              </span>
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
