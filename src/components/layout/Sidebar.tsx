import React, { useState } from 'react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  logo?: React.ReactNode;
  logoText?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activePath = '',
  onNavigate,
  logo,
  logoText = 'FROTA',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        bg-primary-900 text-white
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-72'}
        border-r border-primary-700
        flex flex-col
        z-50
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary-700 flex items-center justify-between">
        {!collapsed && <h1 className="font-bold text-xl">{logoText}</h1>}
        {logo && <span className="text-2xl flex-shrink-0">{logo}</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-primary-700 p-2 rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          ☰
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(item.path);
            }}
            className={`
              flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-lg
              transition-all duration-200
              ${{
                [activePath === item.path
                  ? 'bg-primary-200 text-primary-900 font-semibold'
                  : 'text-neutral-100 hover:bg-primary-700']: true,
              }
            }
            `}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="flex-1 text-sm font-medium">
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-danger text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-700">
        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-neutral-100 hover:bg-primary-700 rounded-lg transition-colors"
          title="Logout"
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          {!collapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;