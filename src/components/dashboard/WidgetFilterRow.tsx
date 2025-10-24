import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RangeSlider } from '@/components/ui/range-slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterField, FilterOperator, WidgetFilter } from '@/stores/customWidgetsStore';

interface WidgetFilterRowProps {
  filter: WidgetFilter;
  onUpdate: (updates: Partial<WidgetFilter>) => void;
  onRemove: () => void;
}

// Define which fields are numeric
const NUMERIC_FIELDS: FilterField[] = ['salary', 'priority'];

// Define field configurations
const FIELD_CONFIG = {
  salary: {
    label: 'Salary',
    min: 0,
    max: 500000,
    step: 5000,
    format: (val: number) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`,
  },
  priority: {
    label: 'Priority',
    min: 1,
    max: 5,
    step: 1,
    format: (val: number) => val.toString(),
  },
};

// Get available operators for a field
const getOperatorsForField = (field: FilterField): FilterOperator[] => {
  if (NUMERIC_FIELDS.includes(field)) {
    return ['equals', 'notEquals', 'greaterThan', 'lessThan', 'between'];
  }
  return ['equals', 'notEquals', 'contains'];
};

export function WidgetFilterRow({ filter, onUpdate, onRemove }: WidgetFilterRowProps) {
  const isNumericField = NUMERIC_FIELDS.includes(filter.field);
  const isBetweenOperator = filter.operator === 'between';
  const availableOperators = getOperatorsForField(filter.field);
  
  // State for range values when using "between" operator
  const [rangeMin, setRangeMin] = useState<number>(0);
  const [rangeMax, setRangeMax] = useState<number>(100000);

  // Initialize range values from filter value if it's an array
  useEffect(() => {
    if (isBetweenOperator && Array.isArray(filter.value) && filter.value.length === 2) {
      setRangeMin(Number(filter.value[0]));
      setRangeMax(Number(filter.value[1]));
    } else if (isNumericField && filter.field === 'salary') {
      setRangeMin(0);
      setRangeMax(100000);
    } else if (isNumericField && filter.field === 'priority') {
      setRangeMin(1);
      setRangeMax(5);
    }
  }, [filter.field, filter.value, isBetweenOperator, isNumericField]);

  // Handle field change
  const handleFieldChange = (newField: FilterField) => {
    const newOperators = getOperatorsForField(newField);
    // Reset operator if current one is not available for new field
    const operator = newOperators.includes(filter.operator) 
      ? filter.operator 
      : newOperators[0];
    
    onUpdate({ 
      field: newField,
      operator,
      value: NUMERIC_FIELDS.includes(newField) ? 0 : '',
    });
  };

  // Handle operator change
  const handleOperatorChange = (newOperator: FilterOperator) => {
    if (newOperator === 'between' && isNumericField) {
      // Initialize with range values
      const config = FIELD_CONFIG[filter.field as keyof typeof FIELD_CONFIG];
      if (config) {
        const min = config.min;
        const max = Math.floor(config.max / 2);
        setRangeMin(min);
        setRangeMax(max);
        onUpdate({ operator: newOperator, value: [String(min), String(max)] });
      }
    } else {
      onUpdate({ 
        operator: newOperator,
        value: isNumericField ? 0 : '',
      });
    }
  };

  // Handle range change
  const handleRangeChange = (values: number[]) => {
    setRangeMin(values[0]);
    setRangeMax(values[1]);
    onUpdate({ value: [String(values[0]), String(values[1])] });
  };

  // Render value input based on field type and operator
  const renderValueInput = () => {
    if (!isNumericField) {
      // String input for text fields
      return (
        <Input
          placeholder="Value"
          value={filter.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
        />
      );
    }

    const config = FIELD_CONFIG[filter.field as keyof typeof FIELD_CONFIG];
    if (!config) return null;

    if (isBetweenOperator) {
      // Range slider for "between" operator
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Range: {config.format(rangeMin)} - {config.format(rangeMax)}
          </div>
          <RangeSlider
            min={config.min}
            max={config.max}
            step={config.step}
            values={[rangeMin, rangeMax]}
            onChange={handleRangeChange}
            formatValue={config.format}
          />
        </div>
      );
    }

    // Number input for other numeric operators
    return (
      <Input
        type="number"
        placeholder="Value"
        min={config.min}
        max={config.max}
        step={config.step}
        value={filter.value as number}
        onChange={(e) => onUpdate({ value: Number(e.target.value) })}
      />
    );
  };

  return (
    <div className="flex gap-2 items-start p-3 border rounded-lg bg-card">
      <div className="flex-1 space-y-3">
        {/* Field and Operator row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Field selector */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Field</Label>
            <Select
              value={filter.field}
              onValueChange={handleFieldChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="companyName">Company</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="priority">Priority (1-5)</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="workType">Work Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator selector */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Operator</Label>
            <Select
              value={filter.operator}
              onValueChange={handleOperatorChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op === 'equals' && '='}
                    {op === 'notEquals' && '≠'}
                    {op === 'contains' && 'Contains'}
                    {op === 'greaterThan' && '>'}
                    {op === 'lessThan' && '<'}
                    {op === 'between' && 'Between'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Value input */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Value</Label>
          {renderValueInput()}
        </div>

        {/* Helper text for numeric fields */}
        {isNumericField && (
          <div className="text-xs text-muted-foreground">
            {filter.field === 'salary' && 'Filter applications by salary range'}
            {filter.field === 'priority' && 'Filter by priority level (1=lowest, 5=highest)'}
          </div>
        )}
      </div>

      {/* Remove button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="mt-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
