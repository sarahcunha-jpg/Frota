import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3 text-neutral-600">{icon}</span>}
        <input
          id={inputId}
          className={`
            w-full px-3 py-2
            ${icon ? 'pl-10' : ''}
            border border-neutral-300 rounded-lg
            text-neutral-900 text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            transition-all duration-200
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${error ? 'border-danger focus:border-danger focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
      {helpText && !error && <p className="text-xs text-neutral-600">{helpText}</p>}
    </div>
  );
};

export default Input;