import React from 'react';
import { colors, spacing, shadows, borderRadius } from '../../styles/tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, header, footer, hoverable = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg border border-gray-200
          transition-all duration-200
          ${hoverable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'shadow-sm'}
          ${className}
        `}
        style={{
          boxShadow: shadows.sm,
          borderRadius: borderRadius.lg,
          padding: spacing.4,
        }}
        {...props}
      >
        {header && (
          <div
            style={{
              paddingBottom: spacing.3,
              marginBottom: spacing.3,
              borderBottom: `1px solid #E5E7EB`,
            }}
          >
            {header}
          </div>
        )}
        
        <div>{children}</div>
        
        {footer && (
          <div
            style={{
              paddingTop: spacing.3,
              marginTop: spacing.3,
              borderTop: `1px solid #E5E7EB`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
