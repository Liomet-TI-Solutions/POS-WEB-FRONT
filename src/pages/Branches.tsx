import { useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import type { Branch } from '@/types';

// Mock branches data
const mockBranches: Branch[] = [
  { id: '1', name: 'Sucursal Centro', address: 'Av. Principal #123, Col. Centro', isActive: true, businessId: '1' },
  { id: '2', name: 'Sucursal Norte', address: 'Calle Norte #456, Col. Industrial', isActive: true, businessId: '1' },
  { id: '3', name: 'Sucursal Sur', address: 'Av. Sur #789, Col. Residencial', isActive: false, businessId: '1' },
  { id: '4', name: 'Sucursal Poniente', address: 'Blvd. Poniente #321, Col. Comercial', isActive: true, businessId: '1' },
];

export default function Branches() {
  const { hasPermission } = useAuth();
  const [branches] = useState<Branch[]>(mockBranches);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const canManageBranches = hasPermission(['OWNER']);

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: branches.length,
    active: branches.filter((b) => b.isActive).length,
    inactive: branches.filter((b) => !b.isActive).length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sucursales</h1>
          <p className="text-muted-foreground">
            {canManageBranches
              ? 'Administra las sucursales de tu negocio'
              : 'Vista de sucursales'}
          </p>
        </div>
        {canManageBranches && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva sucursal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear sucursal</DialogTitle>
                <DialogDescription>
                  Agrega una nueva sucursal a tu negocio
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la sucursal</Label>
                  <Input id="name" placeholder="Ej. Sucursal Centro" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Dirección completa" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Sucursal activa</Label>
                  <Switch id="active" defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  Crear sucursal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-active/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-status-active" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-inactive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-status-inactive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Inactivas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar sucursal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Branches grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    branch.isActive ? 'bg-status-active/10' : 'bg-status-inactive/10'
                  }`}>
                    <MapPin className={`w-6 h-6 ${
                      branch.isActive ? 'text-status-active' : 'text-status-inactive'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{branch.name}</h3>
                    <Badge variant={branch.isActive ? 'active' : 'inactive'}>
                      {branch.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
                {canManageBranches && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Power className="w-4 h-4 mr-2" />
                        {branch.isActive ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{branch.address}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <MapPin className="w-12 h-12 mb-2 opacity-50" />
          <p>No se encontraron sucursales</p>
        </div>
      )}
    </div>
  );
}
