import React from 'react';
import { spacing, typography } from '../../styles/tokens';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div
      style={{
        marginBottom: spacing.8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing.4,
      }}
    >
      <div>
        <h1 style={{ ...typography.h1, marginBottom: spacing.2 }}>
          {title}
        </h1>
        {description && (
          <p style={{ ...typography.bodySm, color: '#6B7280' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
