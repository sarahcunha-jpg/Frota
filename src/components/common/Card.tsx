import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noBorder?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  noPadding = false,
  noBorder = false,
  clickable = false,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg
        ${noBorder ? '' : 'border border-neutral-300'}
        ${!noPadding ? 'p-4 lg:p-6' : ''}
        ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
        shadow-sm
        ${className}
      `}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-2">
          {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
          <div className="flex-1">
            {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;