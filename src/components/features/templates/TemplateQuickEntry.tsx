import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTemplateStore } from '@/stores/templateStore';
import type { Template } from '@/types/template';

interface TemplateQuickEntryProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (content: string) => void;
}

export function TemplateQuickEntry({
  template,
  open,
  onOpenChange,
  onSubmit,
}: TemplateQuickEntryProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [resolvedContent, setResolvedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const resolveTemplate = useTemplateStore((state) => state.resolveTemplate);

  // Initialize variables with default values
  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {};
      for (const variable of template.variables) {
        initial[variable.key] = variable.defaultValue || '';
      }
      setVariables(initial);
      setCopied(false);
    }
  }, [open, template.variables]);

  // Update resolved content when variables change
  useEffect(() => {
    if (open) {
      const result = resolveTemplate(template.id, variables);
      if (result) {
        setResolvedContent(result.content);
      }
    }
  }, [variables, open, template.id, resolveTemplate]);

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolvedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(resolvedContent);
    }
    onOpenChange(false);
  };

  const isFormValid = template.variables
    .filter((v) => v.required)
    .every((v) => variables[v.key]?.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          {template.description && <DialogDescription>{template.description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6">
          {/* Variable Inputs */}
          {template.variables.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Fill in the details:</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {template.variables.map((variable) => (
                  <div key={variable.key} className="space-y-2">
                    <Label htmlFor={variable.key}>
                      {variable.label}
                      {variable.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Input
                      id={variable.key}
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder}
                      required={variable.required}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Preview:</Label>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!isFormValid}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg border p-4 bg-muted/50 max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {resolvedContent || 'Fill in required fields to see preview'}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {template.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {onSubmit && (
                <Button onClick={handleSubmit} disabled={!isFormValid}>
                  Use Template
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
