import React from 'react';
import { cn } from './utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white border border-neutral-200 rounded-lg p-4 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
}) => (
  <div className="flex justify-between items-start pb-3 border-b border-neutral-200 mb-3">
    <div className="flex items-start gap-3 flex-1">
      {icon && <span className="text-2xl mt-1">{icon}</span>}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn('space-y-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  align = 'right',
}) => (
  <div
    className={cn(
      'pt-4 border-t border-neutral-200 mt-4 flex gap-3',
      align === 'left' && 'justify-start',
      align === 'center' && 'justify-center',
      align === 'right' && 'justify-end'
    )}
  >
    {children}
  </div>
);