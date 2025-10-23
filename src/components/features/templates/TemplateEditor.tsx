import { Eye, Plus, Save, X } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useConfirm } from '@/hooks/useConfirm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
  Template,
  TemplateCategory,
  TemplateVariable,
  TemplateVariableType,
} from '@/types/template';

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  onCancel: () => void;
}

const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: 'application', label: 'Application' },
  { value: 'email', label: 'Email' },
  { value: 'cover-letter', label: 'Cover Letter' },
  { value: 'note', label: 'Note' },
  { value: 'other', label: 'Other' },
];

const VARIABLE_TYPES: { value: TemplateVariableType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'company', label: 'Company' },
  { value: 'position', label: 'Position' },
  { value: 'name', label: 'Name' },
  { value: 'custom', label: 'Custom' },
];

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const nameId = useId();
  const descriptionId = useId();
  const contentId = useId();
  const { alert } = useConfirm();

  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [category, setCategory] = useState<TemplateCategory>(template?.category || 'application');
  const [content, setContent] = useState(template?.content || '');
  const [variables, setVariables] = useState<TemplateVariable[]>(template?.variables || []);
  const [tags, setTags] = useState<string[]>(template?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Extract variables from content
  const extractVariables = useCallback((text: string): string[] => {
    const regex = /{{(\w+)}}/g;
    const matches = text.matchAll(regex);
    return Array.from(new Set(Array.from(matches).map((match) => match[1])));
  }, []);

  useEffect(() => {
    const detectedVars = extractVariables(content);
    const existingKeys = new Set(variables.map((v) => v.key));

    // Add new variables
    const newVars = detectedVars
      .filter((key) => !existingKeys.has(key))
      .map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        type: 'text' as TemplateVariableType,
        required: false,
      }));

    if (newVars.length > 0) {
      setVariables((prev) => [...prev, ...newVars]);
    }

    // Remove variables that are no longer in the content
    setVariables((prev) => prev.filter((v) => detectedVars.includes(v.key)));
  }, [content, extractVariables, variables]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleUpdateVariable = (index: number, updates: Partial<TemplateVariable>) => {
    setVariables((prev) => prev.map((v, i) => (i === index ? { ...v, ...updates } : v)));
  };

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      await alert('Validation Error', 'Name and content are required');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      content,
      variables,
      tags: tags.length > 0 ? tags : undefined,
      isDefault: false,
    });
  };

  const renderPreview = () => {
    let preview = content;
    for (const variable of variables) {
      const placeholder = variable.placeholder || `[${variable.label}]`;
      preview = preview.replace(new RegExp(`{{${variable.key}}}`, 'g'), placeholder);
    }
    return preview;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{template ? 'Edit Template' : 'Create Template'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{name || 'Untitled Template'}</h3>
            {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <pre className="whitespace-pre-wrap font-sans text-sm">{renderPreview()}</pre>
          </div>
        </div>
      ) : (
        <>
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={nameId}>Template Name *</Label>
              <Input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Software Engineer Application"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as TemplateCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Input
              id={descriptionId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor={contentId}>
              Template Content *
              <span className="text-xs text-muted-foreground ml-2">
                Use {'{{'} and {'}'} around variable names, e.g., {'{{company}}'}
              </span>
            </Label>
            <Textarea
              id={contentId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your template content here..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Variables */}
          {variables.length > 0 && (
            <div className="space-y-4">
              <Label>Variables ({variables.length})</Label>
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div
                    key={variable.key}
                    className="grid gap-4 sm:grid-cols-5 p-4 border rounded-lg bg-muted/50"
                  >
                    <div className="space-y-1">
                      <Label className="text-xs">Key</Label>
                      <Input value={variable.key} disabled className="font-mono text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={variable.label}
                        onChange={(e) => handleUpdateVariable(index, { label: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={variable.type}
                        onValueChange={(value) =>
                          handleUpdateVariable(index, { type: value as TemplateVariableType })
                        }
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VARIABLE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={variable.placeholder || ''}
                        onChange={(e) =>
                          handleUpdateVariable(index, { placeholder: e.target.value })
                        }
                        placeholder="Optional"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Required</Label>
                      <div className="flex items-center h-9">
                        <input
                          type="checkbox"
                          checked={variable.required || false}
                          onChange={(e) =>
                            handleUpdateVariable(index, { required: e.target.checked })
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
