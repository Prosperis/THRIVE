import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CHANGELOG } from '@/lib/about';
import { Package, Sparkles, Bug, Zap } from 'lucide-react';

interface ChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const changeTypeIcons = {
  feature: Sparkles,
  fix: Bug,
  improvement: Zap,
  breaking: Package,
};

const changeTypeColors = {
  feature: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  fix: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  improvement: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  breaking: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

export function ChangelogDialog({ open, onOpenChange }: ChangelogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Changelog</DialogTitle>
          <DialogDescription>
            Track new features, improvements, and bug fixes across versions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {CHANGELOG.map((release) => (
              <div key={release.version} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    v{release.version}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{release.date}</span>
                </div>

                <div className="space-y-2">
                  {release.changes.map((change, index) => {
                    const Icon = changeTypeIcons[change.type];
                    return (
                      <div key={index} className="flex items-start gap-3 pl-4">
                        <div
                          className={`mt-0.5 p-1.5 rounded-md border ${
                            changeTypeColors[change.type]
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-sm flex-1 leading-relaxed">{change.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
