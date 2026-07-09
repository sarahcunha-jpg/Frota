import React from 'react';
import { colors, spacing, borderRadius } from '../../styles/tokens';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string | number; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], className = '', ...props }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: spacing.2,
              fontSize: '14px',
              fontWeight: 500,
              color: colors.gray700,
            }}
          >
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm
            border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          style={{
            fontSize: '14px',
            borderRadius: borderRadius.md,
            borderColor: error ? colors.danger : '#D1D5DB',
            paddingLeft: spacing.3,
            paddingRight: spacing.3,
            paddingTop: spacing.2,
            paddingBottom: spacing.2,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${colors.gray500}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '20px',
            paddingRight: '36px',
          }}
          {...props}
        >
          <option value="">Selecionar...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p
            style={{
              marginTop: spacing.1,
              fontSize: '12px',
              color: colors.danger,
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
