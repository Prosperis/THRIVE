import { SalaryRangeSlider } from './salary-range-slider';

interface FormSalarySliderProps {
  minValue: number | undefined;
  maxValue: number | undefined;
  onChange: (range: { min: number; max: number }) => void;
  currency?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Form-friendly salary slider component
 * 
 * Wraps SalaryRangeSlider for use in react-hook-form contexts.
 * Replaces separate min/max number inputs with a visual dual-handle slider.
 * 
 * @example
 * ```tsx
 * // In a form with Controller or custom handling
 * <FormSalarySlider
 *   minValue={form.watch('salaryMin')}
 *   maxValue={form.watch('salaryMax')}
 *   onChange={(range) => {
 *     form.setValue('salaryMin', range.min);
 *     form.setValue('salaryMax', range.max);
 *   }}
 *   currency="USD"
 * />
 * ```
 */
export function FormSalarySlider({
  minValue = 0,
  maxValue = 500000,
  onChange,
  currency = 'USD',
  disabled = false,
  className,
}: FormSalarySliderProps) {
  return (
    <div className={className}>
      <SalaryRangeSlider
        minValue={minValue}
        maxValue={maxValue}
        onChange={onChange}
        currency={currency}
        disabled={disabled}
      />
    </div>
  );
}
