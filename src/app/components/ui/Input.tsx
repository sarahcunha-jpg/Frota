import React from 'react';
import { cn } from './utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, iconPosition = 'left', error, className, ...props }, ref) => (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border rounded-md text-sm font-normal focus:outline-none focus:ring-2 transition-colors',
          error
            ? 'border-danger focus:ring-danger bg-danger_light'
            : 'border-neutral-300 focus:ring-primary-500 bg-white',
          icon && iconPosition === 'left' && 'pl-10',
          icon && iconPosition === 'right' && 'pr-10',
          className
        )}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
          {icon}
        </span>
      )}
    </div>
  )
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-neutral-300 rounded-md text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white',
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
);

Select.displayName = 'Select';

interface TextAreaProps extends React.TextAreaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border rounded-md text-sm font-normal focus:outline-none focus:ring-2 transition-colors resize-none',
        error
          ? 'border-danger focus:ring-danger bg-danger_light'
          : 'border-neutral-300 focus:ring-primary-500 bg-white',
        className
      )}
      {...props}
    />
  )
);

TextArea.displayName = 'TextArea';