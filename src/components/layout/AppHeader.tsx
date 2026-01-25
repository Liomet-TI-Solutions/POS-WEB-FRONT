import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from './AppSidebar';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onSidebarToggle: () => void;
}

export function AppHeader({ onSidebarToggle }: AppHeaderProps) {
  const navigate = useNavigate();
  const {
    user,
    subscription,
    activeBranch,
    branches,
    logout,
    setActiveBranch,
    isSubscriptionActive,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeBranches = branches.filter((b) => b.isActive);

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'OWNER':
        return 'owner';
      case 'ADMINISTRADOR':
        return 'admin';
      default:
        return 'cashier';
    }
  };

  const getSubscriptionStatusColor = () => {
    if (!subscription) return 'inactive';
    switch (subscription.status) {
      case 'active':
        return 'active';
      case 'trial':
        return 'pending';
      default:
        return 'inactive';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border px-4 flex items-center justify-between gap-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <SidebarTrigger onClick={onSidebarToggle} />
        
        {/* Subscription status indicator */}
        <div className="hidden sm:flex items-center gap-2">
          {isSubscriptionActive() ? (
            <div className="flex items-center gap-1.5 text-status-active">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Suscripción activa</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-status-inactive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">Suscripción vencida</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Branch selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate hidden sm:inline">
                {activeBranch?.name || 'Seleccionar sucursal'}
              </span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sucursales</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeBranches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => setActiveBranch(branch)}
                className={cn(
                  'cursor-pointer',
                  activeBranch?.id === branch.id && 'bg-accent'
                )}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{branch.name}</span>
                {activeBranch?.id === branch.id && (
                  <CheckCircle2 className="w-4 h-4 ml-auto text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {activeBranches.length === 0 && (
              <DropdownMenuItem disabled>
                No hay sucursales activas
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0">
                  {user?.role}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
