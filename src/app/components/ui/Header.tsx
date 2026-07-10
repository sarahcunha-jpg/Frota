import React from 'react';
import { cn } from './utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  collapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  collapsed,
}) => {
  return (
    <header className={cn(
      'bg-white border-b border-neutral-200 transition-all duration-300',
      collapsed ? 'ml-20' : 'ml-72'
    )}>
      <div className="px-6 py-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="text-neutral-600 text-base mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </header>
  );
};