import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../../styles/tokens';

interface TopBarProps {
  title?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  notifications?: number;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  user,
  notifications = 0,
  onMenuClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  return (
    <header
      style={{
        marginLeft: '260px',
        height: '64px',
        backgroundColor: colors.white,
        borderBottom: `1px solid #E5E7EB`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: spacing.6,
        paddingLeft: spacing.6,
        boxShadow: shadows.sm,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.4 }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
            }}
          >
            ☰
          </button>
        )}
        {title && (
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: colors.gray900 }}>
            {title}
          </h1>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.4 }}>
        {/* Search bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.2,
            backgroundColor: colors.gray100,
            borderRadius: borderRadius.lg,
            paddingLeft: spacing.3,
            paddingRight: spacing.3,
            height: '40px',
            flex: 1,
            minWidth: '200px',
          }}
        >
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar viaturas, manutenções..."
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              color: colors.gray700,
            }}
          />
        </div>
        
        {/* Notifications */}
        <button
          onClick={onNotificationsClick}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: borderRadius.full,
            transition: 'background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray100;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          🔔
          {notifications > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: colors.danger,
                color: colors.white,
                borderRadius: borderRadius.full,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {notifications}
            </span>
          )}
        </button>
        
        {/* User Profile */}
        <button
          onClick={onProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing.2,
            borderRadius: borderRadius.md,
            transition: 'background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray100;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontWeight: 600,
            }}
          >
            {user?.avatar || user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '14px', color: colors.gray700, fontWeight: 500 }}>
            {user?.name}
          </span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
