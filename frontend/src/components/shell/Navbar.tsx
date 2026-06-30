// ============================================================
// 🚀 Brikes Maker Advertisement - Advance Super v1.0.0
// Phase 2 — Shell UI: Navbar Component
// File: frontend/src/components/shell/Navbar.tsx
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AuthService from '../../services/auth.service';
import type { User } from '../../types/advanced.types';

// ============================================================
// 🔔 NOTIFICATION BELL
// ============================================================

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

const NotificationBell: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeIcon: Record<Notification['type'], string> = {
    info: '💬', success: '✅', warning: '⚠️', error: '❌',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: 'var(--radius)',
          color: 'var(--color-text)',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background var(--transition-speed)',
        }}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            background: 'var(--color-error)', color: '#fff',
            borderRadius: '50%', width: '16px', height: '16px',
            fontSize: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%',
          width: '320px', background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 1000, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px', fontWeight: 600,
            borderBottom: '1px solid var(--color-border)',
            color: 'var(--color-text)', fontSize: '14px',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Notifications</span>
            {unread > 0 && (
              <span style={{ color: 'var(--color-primary)', fontSize: '12px', cursor: 'pointer' }}>
                Mark all read
              </span>
            )}
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', display: 'flex', gap: '10px',
                  background: n.read ? 'transparent' : 'var(--color-primary)11',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-speed)',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{typeIcon[n.type]}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text)' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{n.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// 👤 USER AVATAR DROPDOWN
// ============================================================

const UserMenu: React.FC<{ user: User }> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const menuItems = [
    { icon: '👤', label: 'My Profile',      path: '/profile' },
    { icon: '⚙️', label: 'Settings',         path: '/settings' },
    { icon: '🔑', label: 'API Keys',         path: '/settings/api-keys' },
    { icon: '💳', label: 'Billing',          path: '/billing' },
    { icon: '📊', label: 'Usage Stats',      path: '/usage' },
    { divider: true },
    { icon: '🚪', label: 'Logout',           action: () => AuthService.logout(), danger: true },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: 'var(--radius)',
          transition: 'background var(--transition-speed)',
        }}
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={initials}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700,
          }}>
            {initials}
          </div>
        )}
        <div style={{ textAlign: 'left', display: 'none' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
            {user.firstName} {user.lastName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
            {user.tier} plan
          </div>
        </div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%',
          width: '220px', background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 1000, overflow: 'hidden',
        }}>
          {/* User info header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)' }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {user.email}
            </div>
            <div style={{
              marginTop: '6px', display: 'inline-block',
              padding: '2px 8px', borderRadius: '99px',
              background: 'var(--color-primary)22',
              color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {user.tier}
            </div>
          </div>

          {/* Menu items */}
          {menuItems.map((item, i) =>
            'divider' in item ? (
              <div key={i} style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
            ) : (
              <button
                key={i}
                onClick={() => { item.action?.(); setOpen(false); }}
                style={{
                  width: '100%', padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', textAlign: 'left',
                  color: item.danger ? 'var(--color-error)' : 'var(--color-text)',
                  transition: 'background var(--transition-speed)',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// 🔍 SEARCH BAR
// ============================================================

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
      <span style={{
        position: 'absolute', left: '12px', top: '50%',
        transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
        pointerEvents: 'none', fontSize: '14px',
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search campaigns, videos..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '8px 12px 8px 36px',
          background: 'var(--color-background)',
          border: `1px solid ${focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius)',
          color: 'var(--color-text)', fontSize: '13px',
          outline: 'none', transition: 'border-color var(--transition-speed)',
          fontFamily: 'var(--font-family)',
          boxSizing: 'border-box',
        }}
      />
      {query && (
        <button onClick={() => setQuery('')} style={{
          position: 'absolute', right: '10px', top: '50%',
          transform: 'translateY(-50%)', background: 'none',
          border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
          fontSize: '12px', padding: '2px',
        }}>✕</button>
      )}
    </div>
  );
};

// ============================================================
// 🧭 MAIN NAVBAR
// ============================================================

interface NavbarProps {
  user: User | null;
  notifications?: Notification[];
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications = [],
  onMenuToggle,
  sidebarOpen,
}) => {
  const { toggleMode, resolvedMode } = useTheme();

  return (
    <header style={{
      height: '60px',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '12px',
      position: 'sticky', top: 0, zIndex: 100,
      fontFamily: 'var(--font-family)',
      transition: 'background var(--transition-speed)',
    }}>

      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', borderRadius: 'var(--radius)',
          color: 'var(--color-text)', fontSize: '18px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          transition: 'background var(--transition-speed)',
        }}
      >
        <span style={{
          display: 'block', width: '18px', height: '2px',
          background: 'currentColor', borderRadius: '2px',
          transition: `transform var(--transition-speed)`,
          transform: sidebarOpen ? 'rotate(45deg) translateY(6px)' : 'none',
        }} />
        <span style={{
          display: 'block', width: '18px', height: '2px',
          background: 'currentColor', borderRadius: '2px',
          opacity: sidebarOpen ? 0 : 1,
          transition: `opacity var(--transition-speed)`,
        }} />
        <span style={{
          display: 'block', width: '18px', height: '2px',
          background: 'currentColor', borderRadius: '2px',
          transition: `transform var(--transition-speed)`,
          transform: sidebarOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
        }} />
      </button>

      {/* Logo */}
      <div style={{
        fontWeight: 800, fontSize: '16px',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        whiteSpace: 'nowrap', letterSpacing: '-0.3px',
      }}>
        Brikes Maker
      </div>

      {/* Search */}
      <SearchBar />

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>

        {/* Theme toggle */}
        <button
          onClick={toggleMode}
          aria-label="Toggle theme"
          title={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: 'var(--radius)',
            fontSize: '18px', lineHeight: 1,
            transition: 'background var(--transition-speed)',
          }}
        >
          {resolvedMode === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <NotificationBell notifications={notifications} />

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} />

        {/* User menu */}
        {user ? (
          <UserMenu user={user} />
        ) : (
          <button style={{
            padding: '6px 14px', borderRadius: 'var(--radius)',
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
export type { NavbarProps, Notification };
