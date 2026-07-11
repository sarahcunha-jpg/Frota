import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  options,
  placeholder,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3 py-2 border border-neutral-300 rounded-lg
          text-neutral-900 text-sm
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          transition-all duration-200
          disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
          ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
      {helpText && !error && <p className="text-xs text-neutral-600">{helpText}</p>}
    </div>
  );
};

export default Select;