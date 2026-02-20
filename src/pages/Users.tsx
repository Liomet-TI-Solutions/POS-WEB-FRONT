import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import {
  Search,
  Plus,
  Users as UsersIcon,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  MapPin,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { User, UserRole } from "@/types";

// Mock users data
const mockUsers: (User & { branchName: string; isActive: boolean })[] = [
  {
    id: "1",
    email: "owner@demo.com",
    name: "Carlos Mendoza",
    role: "OWNER",
    branchName: "Todas",
    isActive: true,
  },
  {
    id: "2",
    email: "admin@demo.com",
    name: "María García",
    role: "ADMINISTRADOR",
    branchName: "Sucursal Centro",
    isActive: true,
  },
  {
    id: "3",
    email: "cajero@demo.com",
    name: "Juan López",
    role: "CAJERO",
    branchName: "Sucursal Centro",
    isActive: true,
  },
  {
    id: "4",
    email: "cajero2@demo.com",
    name: "Ana Martínez",
    role: "CAJERO",
    branchName: "Sucursal Norte",
    isActive: true,
  },
  {
    id: "5",
    email: "admin2@demo.com",
    name: "Pedro Sánchez",
    role: "ADMINISTRADOR",
    branchName: "Sucursal Norte",
    isActive: false,
  },
];

const roleLabels: Record<UserRole, string> = {
  OWNER: "Propietario",
  ADMINISTRADOR: "Administrador",
  CAJERO: "Cajero",
};

export default function Users() {
  const { toast } = useToast();

  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CAJERO");
  const [branch, setBranch] = useState("1");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    owners: users.filter((u) => u.role === "OWNER").length,
    admins: users.filter((u) => u.role === "ADMINISTRADOR").length,
    cashiers: users.filter((u) => u.role === "CAJERO").length,
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "OWNER":
        return "owner";
      case "ADMINISTRADOR":
        return "admin";
      default:
        return "cashier";
    }
  };

  // Abrir diálogo en modo crear
  function openCreate() {
    setMode("create");
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("CAJERO");
    setBranch("1");
    setShowCreateDialog(true);
  }

  // Abrir diálogo en modo editar y precargar datos
  function openEdit(user: (typeof mockUsers)[number]) {
    setMode("edit");
    setEditingId(user.id);
    setName(user.name || "");
    setEmail(user.email || "");
    setPassword("");
    setRole(user.role as UserRole);
    const branchMap: Record<string, string> = {
      "Sucursal Centro": "1",
      "Sucursal Norte": "2",
      "Sucursal Poniente": "4",
      Todas: "0",
    };
    setBranch(branchMap[user.branchName] ?? "1");
    setShowCreateDialog(true);
  }

  // Guardar (crear o actualizar)
  function handleSave() {
    if (!name.trim() || !email.trim()) {
      alert("Nombre y correo son requeridos");
      return;
    }

    // Crear un toast de progreso y guardar su controlador
    const t = toast({
      title: "Guardando",
      description:
        mode === "create" ? "Creando usuario..." : "Actualizando usuario...",
    });

    try {
      if (mode === "create") {
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          role,
          branchName:
            branch === "1"
              ? "Sucursal Centro"
              : branch === "2"
                ? "Sucursal Norte"
                : branch === "4"
                  ? "Sucursal Poniente"
                  : "Todas",
          isActive: true,
        };
        setUsers((prev) => [...prev, newUser]);

        // Actualizar el mismo toast a estado de éxito
        t.update({
          title: "Usuario creado",
          description: `${name} se creó correctamente.`,
          // opcional: cerrar automáticamente
          onOpenChange: (open) => {
            if (!open) t.dismiss();
          },
        });
      } else if (mode === "edit" && editingId) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingId
              ? {
                  ...u,
                  name,
                  email,
                  role,
                  branchName:
                    branch === "1"
                      ? "Sucursal Centro"
                      : branch === "2"
                        ? "Sucursal Norte"
                        : branch === "4"
                          ? "Sucursal Poniente"
                          : "Todas",
                }
              : u,
          ),
        );

        t.update({
          title: "Cambios guardados",
          description: `${name} se actualizó correctamente.`,
          onOpenChange: (open) => {
            if (!open) t.dismiss();
          },
        });
      }

      setShowCreateDialog(false);
    } catch (error) {
      // En caso de error, actualizar el toast a estado de error
      t.update({
        title: "Error",
        description: "No se pudo guardar el usuario. Intenta de nuevo.",
      });
    }
  }

  // Estado para eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<
    (typeof mockUsers)[number] | null
  >(null);

  function openDelete(user: (typeof mockUsers)[number]) {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }

  // Confirmar eliminación: eliminar localmente 
  function handleConfirmDelete() {
    if (!userToDelete) return;

    try {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

      setShowDeleteDialog(false);

      toast({
        title: "Usuario eliminado",
        description: `${userToDelete.name} fue eliminado correctamente.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. Intenta de nuevo.",
      });
    } finally {
      setUserToDelete(null);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Crear usuario" : "Editar usuario"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Agrega un nuevo usuario al sistema"
                  : "Modifica los datos del usuario"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "edit" ? "Dejar vacío para no cambiar" : "••••••••"
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CAJERO">Cajero</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="OWNER">Propietario</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">Sucursal asignada</Label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="1">Sucursal Centro</option>
                  <option value="2">Sucursal Norte</option>
                  <option value="4">Sucursal Poniente</option>
                  <option value="0">Todas</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {mode === "create" ? "Crear usuario" : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación de eliminación */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar{" "}
                {userToDelete?.name ?? "este usuario"}? Esta acción no se puede
                deshacer.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4" />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setUserToDelete(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="ml-2"
                onClick={handleConfirmDelete}
                variant="destructive"
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-primary" />
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
                <UserCheck className="w-5 h-5 text-status-active" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.owners}</p>
                <p className="text-xs text-muted-foreground">Propietarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cashiers}</p>
                <p className="text-xs text-muted-foreground">Cajeros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.branchName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "active" : "inactive"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDelete(user)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UsersIcon className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
