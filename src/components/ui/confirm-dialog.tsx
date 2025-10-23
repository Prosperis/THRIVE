import { AlertTriangle, Info } from 'lucide-react';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';

export type ConfirmDialogType = 'confirm' | 'alert' | 'danger';

export interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: ConfirmDialogOptions;
}

export function ConfirmDialog({ open, onOpenChange, options }: ConfirmDialogProps) {
  const {
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'confirm',
    onConfirm,
    onCancel,
  } = options;

  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'alert':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getConfirmVariant = () => {
    switch (type) {
      case 'danger':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-left whitespace-pre-line">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          {type !== 'alert' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="button"
            variant={getConfirmVariant()}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
