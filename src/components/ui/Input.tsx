import React from 'react';
import { colors, spacing, borderRadius } from '../../styles/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
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
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: spacing.3,
                display: 'flex',
                alignItems: 'center',
                color: colors.gray400,
              }}
            >
              {icon}
            </span>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 text-sm
              border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${error ? 'border-red-500' : ''}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
            style={{
              fontSize: '14px',
              borderRadius: borderRadius.md,
              borderColor: error ? colors.danger : '#D1D5DB',
              paddingLeft: icon ? '40px' : spacing.3,
              paddingRight: spacing.3,
              paddingTop: spacing.2,
              paddingBottom: spacing.2,
              transition: 'all 200ms ease',
            }}
            {...props}
          />
        </div>
        
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

Input.displayName = 'Input';

export default Input;
