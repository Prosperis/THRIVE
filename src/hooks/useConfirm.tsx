import * as React from 'react';
import { ConfirmDialog, type ConfirmDialogOptions } from '@/components/ui/confirm-dialog';

interface ConfirmContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (title: string, description?: string) => Promise<void>;
}

const ConfirmContext = React.createContext<ConfirmContextValue | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmDialogOptions>({
    title: '',
    description: '',
  });
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions({
        ...opts,
        onConfirm: async () => {
          if (opts.onConfirm) {
            await opts.onConfirm();
          }
          resolve(true);
        },
        onCancel: () => {
          if (opts.onCancel) {
            opts.onCancel();
          }
          resolve(false);
        },
      });
      setOpen(true);
    });
  }, []);

  const alert = React.useCallback(
    (title: string, description?: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        resolveRef.current = () => resolve();
        setOptions({
          title,
          description,
          type: 'alert',
          confirmText: 'OK',
          onConfirm: () => {
            resolve();
          },
        });
        setOpen(true);
      });
    },
    []
  );

  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && resolveRef.current) {
      // If dialog is closed without explicit confirm/cancel, treat as cancel
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      <ConfirmDialog open={open} onOpenChange={handleOpenChange} options={options} />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
