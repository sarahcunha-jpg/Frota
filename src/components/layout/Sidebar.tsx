import React from 'react';
import { colors, spacing, borderRadius } from '../../styles/tokens';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem }) => {
  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        backgroundColor: colors.primary,
        color: colors.white,
        padding: spacing.6,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: spacing.8,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.2,
        }}
      >
        🚓 Frota
      </div>
      
      <nav>
        <ul style={{ listStyle: 'none' }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: spacing.2 }}>
              <button
                onClick={item.onClick}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.3,
                  padding: `${spacing.3} ${spacing.4}`,
                  backgroundColor: activeItem === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: colors.white,
                  border: 'none',
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 200ms ease',
                  borderLeft: activeItem === item.id ? `3px solid ${colors.white}` : '3px solid transparent',
                  paddingLeft: activeItem === item.id ? spacing.3 : spacing.4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    activeItem === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
