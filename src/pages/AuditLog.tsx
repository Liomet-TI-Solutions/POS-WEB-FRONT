import { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  User,
  Package,
  ShoppingCart,
  Settings,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AuditLogEntry } from '@/types';

// Mock audit log data
const mockAuditLog: AuditLogEntry[] = [
  {
    id: '1',
    action: 'Venta realizada',
    userId: '3',
    userName: 'Juan López',
    details: 'Ticket #001234 - $450.00 - Pago en efectivo',
    timestamp: '2025-01-08T10:30:00Z',
    entityType: 'sale',
    entityId: '1',
  },
  {
    id: '2',
    action: 'Producto creado',
    userId: '2',
    userName: 'María García',
    details: 'Nuevo producto: Galletas María 200g',
    timestamp: '2025-01-08T10:15:00Z',
    entityType: 'product',
    entityId: '17',
  },
  {
    id: '3',
    action: 'Usuario modificado',
    userId: '1',
    userName: 'Carlos Mendoza',
    details: 'Cambio de rol: Juan López → Administrador',
    timestamp: '2025-01-08T09:45:00Z',
    entityType: 'user',
    entityId: '3',
  },
  {
    id: '4',
    action: 'Venta cancelada',
    userId: '3',
    userName: 'Juan López',
    details: 'Ticket #001230 cancelado - Motivo: Cliente solicitó cancelación',
    timestamp: '2025-01-08T09:30:00Z',
    entityType: 'sale',
    entityId: '5',
  },
  {
    id: '5',
    action: 'Configuración actualizada',
    userId: '1',
    userName: 'Carlos Mendoza',
    details: 'Datos del negocio actualizados',
    timestamp: '2025-01-08T09:00:00Z',
    entityType: 'settings',
  },
  {
    id: '6',
    action: 'Inicio de sesión',
    userId: '2',
    userName: 'María García',
    details: 'Inicio de sesión exitoso desde 192.168.1.100',
    timestamp: '2025-01-08T08:30:00Z',
    entityType: 'auth',
  },
  {
    id: '7',
    action: 'Sucursal desactivada',
    userId: '1',
    userName: 'Carlos Mendoza',
    details: 'Sucursal Sur desactivada temporalmente',
    timestamp: '2025-01-08T08:00:00Z',
    entityType: 'branch',
    entityId: '3',
  },
  {
    id: '8',
    action: 'Producto actualizado',
    userId: '2',
    userName: 'María García',
    details: 'Precio actualizado: Coca Cola 600ml $17.00 → $18.00',
    timestamp: '2025-01-07T17:30:00Z',
    entityType: 'product',
    entityId: '1',
  },
];

const entityTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sale: ShoppingCart,
  product: Package,
  user: User,
  settings: Settings,
  auth: User,
  branch: Settings,
};

const entityTypeLabels: Record<string, string> = {
  sale: 'Ventas',
  product: 'Productos',
  user: 'Usuarios',
  settings: 'Configuración',
  auth: 'Autenticación',
  branch: 'Sucursales',
};

export default function AuditLog() {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLog);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.entityType === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hrs`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bitácora</h1>
        <p className="text-muted-foreground">Registro de actividades del sistema</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en la bitácora..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {typeFilter === 'all' ? 'Todos los tipos' : entityTypeLabels[typeFilter]}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>
              Todos los tipos
            </DropdownMenuItem>
            {Object.entries(entityTypeLabels).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => setTypeFilter(key)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logs list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const Icon = entityTypeIcons[log.entityType] || FileText;
              
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{log.action}</span>
                      <Badge variant="secondary" className="text-xs">
                        {entityTypeLabels[log.entityType]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.userName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron registros</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
