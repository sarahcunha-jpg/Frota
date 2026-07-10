import React, { useState } from 'react';
import { cn } from './utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  menuItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
  }>;
  headerTitle: string;
  headerSubtitle?: string;
  headerActions?: React.ReactNode;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  menuItems,
  headerTitle,
  headerSubtitle,
  headerActions,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        items={menuItems}
        onLogout={onLogout}
        collapsed={collapsed}
        onToggleCollapse={setCollapsed}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          collapsed ? 'ml-20' : 'ml-72'
        )}
      >
        {/* Header */}
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          actions={headerActions}
          collapsed={collapsed}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};