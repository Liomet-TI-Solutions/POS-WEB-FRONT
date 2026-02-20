import { useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
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
import { useToast } from "../hooks/use-toast";
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
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Dialog / form state (reutilizado para crear y editar)
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchActive, setBranchActive] = useState(true);

  // Delete confirmation modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const { toast } = useToast();

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

  // Abrir diálogo en modo crear
  function openCreateBranch() {
    setMode('create');
    setEditingBranchId(null);
    setBranchName('');
    setBranchAddress('');
    setBranchActive(true);
    setShowCreateDialog(true);
  }

  // Abrir diálogo en modo editar y precargar datos
  function openEditBranch(branch: Branch) {
    setMode('edit');
    setEditingBranchId(branch.id);
    setBranchName(branch.name);
    setBranchAddress(branch.address);
    setBranchActive(branch.isActive);
    setShowCreateDialog(true);
  }

  // Guardar (crear o actualizar) con toast
  function handleSaveBranch() {
    if (!branchName.trim()) {
      toast({ title: 'Nombre requerido', description: 'Ingresa el nombre de la sucursal.' });
      return;
    }

    // toast inicial (progreso)
    const t = toast({
      title: mode === 'create' ? 'Creando sucursal' : 'Actualizando sucursal',
      description: mode === 'create' ? 'Creando...' : 'Guardando cambios...',
    });

    try {
      if (mode === 'create') {
        const newBranch: Branch = {
          id: Date.now().toString(),
          name: branchName.trim(),
          address: branchAddress.trim(),
          isActive: branchActive,
          businessId: '1',
        };
        setBranches((prev) => [...prev, newBranch]);

        // actualizar toast a éxito (si tu toast.update acepta Partial)
        if (t.update) {
          t.update({
            title: 'Sucursal creada',
            description: `${newBranch.name} se creó correctamente.`,
          } as any);
        } else {
          toast({ title: 'Sucursal creada', description: `${newBranch.name} se creó correctamente.` });
        }
      } else if (mode === 'edit' && editingBranchId) {
        setBranches((prev) =>
          prev.map((b) =>
            b.id === editingBranchId
              ? { ...b, name: branchName.trim(), address: branchAddress.trim(), isActive: branchActive }
              : b
          )
        );

        if (t.update) {
          t.update({
            title: 'Cambios guardados',
            description: `${branchName} se actualizó correctamente.`,
          } as any);
        } else {
          toast({ title: 'Cambios guardados', description: `${branchName} se actualizó correctamente.` });
        }
      }

      setShowCreateDialog(false);
      setEditingBranchId(null);
    } catch (err) {
      if (t.update) {
        t.update({
          title: 'Error',
          description: 'No se pudo guardar la sucursal. Intenta de nuevo.',
        } as any);
      } else {
        toast({ title: 'Error', description: 'No se pudo guardar la sucursal. Intenta de nuevo.' });
      }
    }
  }

  // Abrir modal de confirmación para eliminar
  function openDeleteBranch(branch: Branch) {
    setBranchToDelete(branch);
    setShowDeleteDialog(true);
  }

  // Confirmar eliminación con toast y posibilidad de deshacer simple
  function handleConfirmDelete() {
    if (!branchToDelete) return;

    // guardar copia para posible deshacer
    const deleted = branchToDelete;
    setBranches((prev) => prev.filter((b) => b.id !== deleted.id));
    setShowDeleteDialog(false);
    setBranchToDelete(null);

    // toast con acción de deshacer si tu toast soporta action, aquí ejemplo simple
    toast({
      title: 'Sucursal eliminada',
      description: `${deleted.name} fue eliminada.`,
    });

  }

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
              <Button onClick={openCreateBranch}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva sucursal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{mode === 'create' ? 'Crear sucursal' : 'Editar sucursal'}</DialogTitle>
                <DialogDescription>
                  {mode === 'create' ? 'Agrega una nueva sucursal a tu negocio' : 'Modifica los datos de la sucursal'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la sucursal</Label>
                  <Input id="name" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Ej. Sucursal Centro" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} placeholder="Dirección completa" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Sucursal activa</Label>
                  <Switch id="active" checked={branchActive} onCheckedChange={(val) => setBranchActive(Boolean(val))} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowCreateDialog(false); setEditingBranchId(null); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveBranch}>
                  {mode === 'create' ? 'Crear sucursal' : 'Guardar cambios'}
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
                      <DropdownMenuItem onClick={() => openEditBranch(branch)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteBranch(branch)}>
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

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar {branchToDelete?.name ?? 'esta sucursal'}? <br/>Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setBranchToDelete(null); }}>
              Cancelar
            </Button>
            <Button className="ml-2" onClick={handleConfirmDelete} variant="destructive">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredBranches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <MapPin className="w-12 h-12 mb-2 opacity-50" />
          <p>No se encontraron sucursales</p>
        </div>
      )}
    </div>
  );
}
