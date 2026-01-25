import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading, isSubscriptionActive, isBranchActive, activeBranch } = useAuth();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const showSubscriptionWarning = !isSubscriptionActive();
  const showBranchWarning = !isBranchActive() && activeBranch;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Alerts */}
        <div className="flex flex-col">
          {showSubscriptionWarning && (
            <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-destructive">
                  Tu suscripción ha vencido
                </p>
                <p className="text-xs text-destructive/80">
                  Renueva tu suscripción para continuar usando el sistema.
                </p>
              </div>
            </div>
          )}
          
          {showBranchWarning && (
            <div className="bg-warning/10 border-b border-warning/20 px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warning">
                  La sucursal seleccionada está inactiva
                </p>
                <p className="text-xs text-warning/80">
                  Selecciona una sucursal activa para realizar operaciones.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <main
          className={cn(
            'flex-1 overflow-auto',
            (showSubscriptionWarning || showBranchWarning) && 'opacity-50 pointer-events-none'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
