import React from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  notifications?: number;
  userInfo?: {
    name: string;
    avatar?: React.ReactNode;
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  actions,
  onMenuClick,
  notifications = 0,
  userInfo,
}) => {
  return (
    <header className="bg-white border-b border-neutral-300 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
            {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Pesquisar..."
            className="hidden md:block px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />

          {/* Notifications */}
          <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            🔔
            {notifications > 0 && (
              <span className="absolute top-1 right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>

          {/* User */}
          {userInfo && (
            <button className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <span className="text-2xl">{userInfo.avatar || '👤'}</span>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-900">{userInfo.name}</p>
                <p className="text-xs text-neutral-600">Gestor</p>
              </div>
            </button>
          )}

          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
};

export default Header;