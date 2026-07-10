import React from 'react';
import { cn } from './utils';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  subtitle,
  children,
  className,
}) => (
  <div
    className={cn(
      'bg-white border border-neutral-200 rounded-lg p-4 mb-4',
      className
    )}
  >
    <div className="mb-4">
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl mt-1">{icon}</span>}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  helperText,
  children,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-neutral-800">
      {label}
      {required && <span className="text-danger ml-1">*</span>}
    </label>
    {children}
    {error && <span className="text-xs text-danger">{error}</span>}
    {helperText && !error && (
      <span className="text-xs text-neutral-600">{helperText}</span>
    )}
  </div>
);

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  onReset?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  loading?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  onReset,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  resetLabel = 'Limpar',
  loading = false,
}) => (
  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 mt-6">
    {onCancel && (
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 font-semibold rounded-md transition"
      >
        {cancelLabel}
      </button>
    )}
    {onReset && (
      <button
        type="reset"
        onClick={onReset}
        className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold border border-neutral-300 rounded-md transition"
      >
        {resetLabel}
      </button>
    )}
    {onSubmit && (
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="px-6 py-2 bg-success hover:bg-green-700 text-white font-semibold rounded-md transition disabled:opacity-50"
      >
        {loading ? '⏳ Salvando...' : submitLabel}
      </button>
    )}
  </div>
);