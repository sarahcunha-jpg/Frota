import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  menuItems: MenuItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  actions?: React.ReactNode;
  notifications?: number;
  userInfo?: {
    name: string;
    avatar?: React.ReactNode;
  };
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  menuItems,
  activePath,
  onNavigate,
  actions,
  notifications,
  userInfo,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activePath={activePath}
        onNavigate={(path) => {
          onNavigate?.(path);
          setMobileSidebarOpen(false);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        {/* Header */}
        <Header
          title={title}
          description={description}
          actions={actions}
          onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          notifications={notifications}
          userInfo={userInfo}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;