import React from 'react';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  children,
  description,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white border border-neutral-300 rounded-lg p-4 lg:p-6 mb-4
        ${className}
      `}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-xl text-primary-900">{icon}</span>}
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        </div>
        {description && <p className="text-sm text-neutral-600 ml-7">{description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export default FormSection;