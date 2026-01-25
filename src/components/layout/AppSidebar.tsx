import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Receipt,
  Users,
  MapPin,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronRight,
  Store,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { NavItem, UserRole } from '@/types';
import { Button } from '@/components/ui/button';

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['OWNER', 'ADMINISTRADOR', 'CAJERO'],
  },
  {
    title: 'Negocio',
    href: '/business',
    icon: Building2,
    roles: ['OWNER'],
  },
  {
    title: 'Suscripción',
    href: '/subscription',
    icon: CreditCard,
    roles: ['OWNER'],
  },
  {
    title: 'Facturación SaaS',
    href: '/billing',
    icon: Receipt,
    roles: ['OWNER'],
  },
  {
    title: 'Usuarios',
    href: '/users',
    icon: Users,
    roles: ['OWNER'],
  },
  {
    title: 'Sucursales',
    href: '/branches',
    icon: MapPin,
    roles: ['OWNER', 'ADMINISTRADOR'],
  },
  {
    title: 'Productos',
    href: '/products',
    icon: Package,
    roles: ['OWNER', 'ADMINISTRADOR'],
  },
  {
    title: 'Punto de Venta',
    href: '/pos',
    icon: ShoppingCart,
    roles: ['OWNER', 'ADMINISTRADOR', 'CAJERO'],
  },
  {
    title: 'Historial de Ventas',
    href: '/sales',
    icon: Receipt,
    roles: ['OWNER', 'ADMINISTRADOR', 'CAJERO'],
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    roles: ['OWNER', 'ADMINISTRADOR'],
  },
  {
    title: 'Bitácora',
    href: '/audit-log',
    icon: FileText,
    roles: ['OWNER'],
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const { user, business, hasPermission } = useAuth();

  const filteredNavItems = navigationItems.filter((item) =>
    hasPermission(item.roles)
  );

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Store className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground truncate max-w-[140px]">
                {business?.shortName || business?.name || 'POS System'}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with user info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}
