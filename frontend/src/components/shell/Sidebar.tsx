// ============================================================
// 🚀 Brikes Maker Advertisement - Advance Super v1.0.0
// Phase 2 — Shell UI: Sidebar Component
// File: frontend/src/components/shell/Sidebar.tsx
// ============================================================

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AuthService from '../../services/auth.service';

// ============================================================
// 📦 TYPES
// ============================================================

interface NavItem {
  icon:     string;
  label:    string;
  path:     string;
  badge?:   number | string;
  children?: NavItem[];
  permission?: string;
}

interface SidebarProps {
  open:        boolean;
  currentPath: string;
  onNavigate:  (path: string) => void;
  collapsed?:  boolean;
  onCollapse?: (v: boolean) => void;
}

// ============================================================
// 🗺️  NAV STRUCTURE
// ============================================================

const NAV_ITEMS: NavItem[] = [
  { icon: '🏠', label: 'Dashboard',    path: '/dashboard' },
  {
    icon: '📢', label: 'Campaigns',    path: '/campaigns',
    children: [
      { icon: '➕', label: 'Create New',   path: '/campaigns/new' },
      { icon: '📋', label: 'All Campaigns',path: '/campaigns' },
      { icon: '📊', label: 'Performance',  path: '/campaigns/performance' },
      { icon: '🎯', label: 'Targeting',    path: '/campaigns/targeting' },
    ],
  },
  {
    icon: '🎬', label: 'Videos',       path: '/videos',
    children: [
      { icon: '🎨', label: 'Studio',       path: '/videos/studio' },
      { icon: '📁', label: 'My Videos',    path: '/videos' },
      { icon: '🤖', label: 'AI Generate',  path: '/videos/generate' },
    ],
  },
  {
    icon: '📊', label: 'Analytics',    path: '/analytics',
    children: [
      { icon: '📈', label: 'Overview',     path: '/analytics' },
      { icon: '🔄', label: 'Conversions',  path: '/analytics/conversions' },
      { icon: '👥', label: 'Audience',     path: '/analytics/audience' },
      { icon: '📑', label: 'Reports',      path: '/analytics/reports' },
    ],
  },
  { icon: '🖼️',  label: 'Media',       path: '/media' },
  { icon: '👥', label: 'Team',         path: '/team',         permission: 'team' },
  { icon: '🔑', label: 'API Keys',     path: '/settings/api-keys', permission: 'api' },
  { icon: '⚙️', label: 'Settings',     path: '/settings' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: '📖', label: 'Docs',         path: '/docs' },
  { icon: '💬', label: 'Support',      path: '/support' },
];

// ============================================================
// 🧩 NAV ITEM COMPONENT
// ============================================================

const SidebarItem: React.FC<{
  item:        NavItem;
  currentPath: string;
  collapsed:   boolean;
  depth?:      number;
  onNavigate:  (path: string) => void;
}> = ({ item, currentPath, collapsed, depth = 0, onNavigate }) => {
  const isActive  = currentPath === item.path || currentPath.startsWith(item.path + '/');
  const hasChildren = !!item.children?.length;
  const [expanded, setExpanded] = useState(isActive);

  const canAccess = !item.permission || AuthService.hasPermission(item.permission, 'read');
  if (!canAccess) return null;

  const handleClick = () => {
    if (hasChildren) { setExpanded(e => !e); }
    else { onNavigate(item.path); }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: collapsed ? '10px 0' : `10px ${12 + depth * 12}px`,
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: isActive
            ? 'linear-gradient(135deg, var(--color-primary)22, var(--color-accent)11)'
            : 'none',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
          fontWeight: isActive ? 600 : 400,
          fontSize: '13px',
          textAlign: 'left',
          transition: 'all var(--transition-speed)',
          fontFamily: 'var(--font-family)',
          position: 'relative',
        }}
      >
        {/* Active indicator bar */}
        {isActive && !collapsed && (
          <span style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: '3px', borderRadius: '0 3px 3px 0',
            background: 'var(--color-primary)',
          }} />
        )}

        <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>

        {!collapsed && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>

            {item.badge !== undefined && (
              <span style={{
                padding: '1px 7px', borderRadius: '99px',
                background: 'var(--color-primary)', color: '#fff',
                fontSize: '10px', fontWeight: 700,
              }}>
                {item.badge}
              </span>
            )}

            {hasChildren && (
              <span style={{
                fontSize: '10px', color: 'var(--color-text-muted)',
                transition: `transform var(--transition-speed)`,
                transform: expanded ? 'rotate(180deg)' : 'none',
              }}>▾</span>
            )}
          </>
        )}
      </button>

      {/* Children */}
      {hasChildren && expanded && !collapsed && (
        <div style={{
          overflow: 'hidden',
          transition: `max-height var(--transition-speed)`,
        }}>
          {item.children!.map(child => (
            <SidebarItem
              key={child.path}
              item={child}
              currentPath={currentPath}
              collapsed={collapsed}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// 🗂️  SIDEBAR
// ============================================================

const Sidebar: React.FC<SidebarProps> = ({
  open,
  currentPath,
  onNavigate,
  collapsed = false,
  onCollapse,
}) => {
  const { resolvedMode } = useTheme();
  const width = collapsed ? '60px' : '240px';

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => onNavigate(currentPath)}
          style={{
            display: 'none',  // shown via media query in real CSS
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 98,
          }}
        />
      )}

      <aside style={{
        width,
        minWidth: width,
        height: '100%',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: `width var(--transition-speed), min-width var(--transition-speed)`,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 99,
        fontFamily: 'var(--font-family)',
      }}>

        {/* Collapse toggle */}
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              position: 'absolute', right: '-12px', top: '72px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', color: 'var(--color-text-muted)',
              zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all var(--transition-speed)',
            }}
          >
            {collapsed ? '›' : '‹'}
          </button>
        )}

        {/* Main nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {!collapsed && (
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
              color: 'var(--color-text-muted)', padding: '4px 12px 8px',
              textTransform: 'uppercase',
            }}>
              Main Menu
            </div>
          )}

          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.path}
              item={item}
              currentPath={currentPath}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)', margin: '0 8px' }} />

        {/* Bottom nav */}
        <nav style={{ padding: '8px' }}>
          {BOTTOM_ITEMS.map(item => (
            <SidebarItem
              key={item.path}
              item={item}
              currentPath={currentPath}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Tier badge */}
        {!collapsed && (
          <div style={{
            margin: '8px', padding: '10px 12px',
            background: 'linear-gradient(135deg, var(--color-primary)22, var(--color-accent)11)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-primary)33',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
              ✨ Advanced Plan
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              100 campaigns · 50GB storage
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
export type { SidebarProps, NavItem };
