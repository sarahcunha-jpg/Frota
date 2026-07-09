import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ children, className = '', header, footer, hoverable = true }: CardProps) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all duration-150 ${hoverable ? 'hover:shadow-md hover:-translate-y-0.5' : ''} ${className}`}>
      {header && <div className="pb-3 border-b border-gray-100 mb-3">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="pt-3 border-t border-gray-100 mt-3">{footer}</div>}
    </div>
  );
}
