import React, { useState } from 'react';
import { cn } from './utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

interface SidebarProps {
  items: MenuItem[];
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-primary-900 text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary-700 flex justify-between items-center">
        <h1
          className={cn(
            'font-bold text-xl transition-opacity',
            collapsed ? 'hidden' : 'block'
          )}
        >
          🔵 FROTA
        </h1>
        <button
          onClick={() => onToggleCollapse?.(!collapsed)}
          className="p-2 hover:bg-primary-700 rounded-md transition"
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          ≡
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-2 px-2 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              'w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
              item.active
                ? 'bg-primary-700 border-l-4 border-primary-200'
                : 'text-neutral-100 hover:bg-primary-700'
            )}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <span className={cn(
              'ml-3 font-medium transition-opacity',
              collapsed ? 'hidden' : 'block'
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      {onLogout && (
        <div className="p-4 border-t border-primary-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-neutral-100 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            title={collapsed ? 'Sair' : undefined}
          >
            <span className="text-xl">🚪</span>
            <span className={cn(
              'ml-3 font-medium',
              collapsed ? 'hidden' : 'block'
            )}>
              Sair
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};