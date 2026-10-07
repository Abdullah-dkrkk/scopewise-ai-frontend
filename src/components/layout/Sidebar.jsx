import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const NAV_ITEMS = [
  {
    to: '/app',
    end: true,
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
        <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/app/projects',
    end: false,
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
        <path d="M2 7h20M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
        <path d="M6 12h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/app/analyze',
    end: false,
    label: 'New Analysis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/app/history',
    end: false,
    label: 'History',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
        <path d="M3 3v5h5M3.05 13a9 9 0 1 0 2.1-7.36L3 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ mobileOpen, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onNavigate}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M12 2 3 7l9 5 9-5-9-5Z" strokeLinejoin="round" />
              <path d="m3 12 9 5 9-5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-heading font-semibold tracking-tight">ScopeWise</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>

        <div className="border-t p-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted"
            >
              <Avatar name={user?.name || 'User'} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-muted-foreground">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border bg-card p-1 shadow-lg">
                <NavLink
                  to="/app/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
