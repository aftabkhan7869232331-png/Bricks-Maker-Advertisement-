// ============================================================
// 🚀 Brikes Maker Advertisement - Advance Super v1.0.0
// Phase 2 — Shell UI: App Shell Layout
// File: frontend/src/components/shell/AppShell.tsx
// ============================================================

import React, { useState, useEffect } from 'react';
import Navbar, { type Notification } from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';
import type { User } from '../../types/advanced.types';

// ============================================================
// 📦 TYPES
// ============================================================

interface AppShellProps {
  children:    React.ReactNode;
  user:        User | null;
  currentPath: string;
  onNavigate:  (path: string) => void;
  notifications?: Notification[];
}

// ============================================================
// 🏗️  APP SHELL
// ============================================================

const AppShell: React.FC<AppShellProps> = ({
  children,
  user,
  currentPath,
  onNavigate,
  notifications = [],
}) => {
  const { activeColors } = useTheme();

  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) { setSidebarOpen(false); setSidebarCollapsed(false); }
      else          { setSidebarOpen(true); }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMenuToggle = () => {
    if (isMobile) setSidebarOpen(o => !o);
    else          setSidebarCollapsed(c => !c);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-family)',
      overflow: 'hidden',
    }}>

      {/* ── Top Navbar ── */}
      <Navbar
        user={user}
        notifications={notifications}
        onMenuToggle={handleMenuToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* ── Body (sidebar + content) ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar — hidden on mobile unless open */}
        <div style={{
          display: (isMobile && !sidebarOpen) ? 'none' : 'flex',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? '60px' : 'auto',
          left: 0, bottom: 0,
          zIndex: isMobile ? 99 : 'auto',
          height: isMobile ? 'calc(100vh - 60px)' : '100%',
        }}>
          <Sidebar
            open={sidebarOpen}
            currentPath={currentPath}
            onNavigate={(path) => { onNavigate(path); if (isMobile) setSidebarOpen(false); }}
            collapsed={!isMobile && sidebarCollapsed}
            onCollapse={!isMobile ? setSidebarCollapsed : undefined}
          />
        </div>

        {/* ── Main content ── */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}>

          {/* Breadcrumb bar */}
          <BreadcrumbBar path={currentPath} onNavigate={onNavigate} />

          {/* Page content */}
          <div style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// ============================================================
// 🗺️  BREADCRUMB BAR
// ============================================================

const ROUTE_LABELS: Record<string, string> = {
  '':           'Home',
  dashboard:    'Dashboard',
  campaigns:    'Campaigns',
  new:          'Create New',
  performance:  'Performance',
  targeting:    'Targeting',
  videos:       'Videos',
  studio:       'Studio',
  generate:     'AI Generate',
  analytics:    'Analytics',
  conversions:  'Conversions',
  audience:     'Audience',
  reports:      'Reports',
  media:        'Media',
  team:         'Team',
  settings:     'Settings',
  'api-keys':   'API Keys',
  docs:         'Documentation',
  support:      'Support',
};

const BreadcrumbBar: React.FC<{ path: string; onNavigate: (p: string) => void }> = ({
  path, onNavigate,
}) => {
  const parts   = path.split('/').filter(Boolean);
  const crumbs  = [
    { label: '🏠', path: '/dashboard' },
    ...parts.map((p, i) => ({
      label: ROUTE_LABELS[p] ?? p.charAt(0).toUpperCase() + p.slice(1),
      path:  '/' + parts.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <div style={{
      padding: '8px 24px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '12px', color: 'var(--color-text-muted)',
      background: 'var(--color-surface)',
      fontFamily: 'var(--font-family)',
    }}>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && <span style={{ opacity: 0.4 }}>/</span>}
          <button
            onClick={() => onNavigate(crumb.path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: i === crumbs.length - 1 ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
              fontSize: '12px', padding: '2px 4px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-family)',
              transition: 'color var(--transition-speed)',
            }}
          >
            {crumb.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default AppShell;
export type { AppShellProps };
