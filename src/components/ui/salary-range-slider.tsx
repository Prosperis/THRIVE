import { RangeSlider } from './range-slider';

interface SalaryRangeSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (range: { min: number; max: number }) => void;
  currency?: string;
  className?: string;
  disabled?: boolean;
}

const SALARY_MIN = 0;
const SALARY_MAX = 500000;
const SALARY_STEP = 5000;

export function SalaryRangeSlider({
  minValue,
  maxValue,
  onChange,
  currency = 'USD',
  className,
  disabled = false,
}: SalaryRangeSliderProps) {
  const formatSalary = (value: number) => {
    // Format with currency symbol
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
      CNY: '¥',
      INR: '₹',
    };

    const symbol = currencySymbols[currency] || '$';

    // Format with K for thousands
    if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(0)}K`;
    }
    return `${symbol}${value.toLocaleString()}`;
  };

  const handleChange = (values: number[]) => {
    onChange({
      min: values[0],
      max: values[1],
    });
  };

  return (
    <RangeSlider
      min={SALARY_MIN}
      max={SALARY_MAX}
      step={SALARY_STEP}
      values={[minValue, maxValue]}
      onChange={handleChange}
      formatValue={formatSalary}
      className={className}
      disabled={disabled}
    />
  );
}
