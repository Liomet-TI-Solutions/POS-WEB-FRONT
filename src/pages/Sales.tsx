import { useState } from 'react';
import {
  Search,
  Filter,
  Receipt,
  MoreVertical,
  Eye,
  XCircle,
  RotateCcw,
  FileText,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import type { Sale, PaymentMethod } from '@/types';

// Mock sales data
const mockSales: Sale[] = [
  {
    id: '1',
    items: [],
    subtotal: 450.00,
    discount: 0,
    total: 450.00,
    paymentMethod: 'cash',
    paymentStatus: 'confirmed',
    branchId: '1',
    userId: '3',
    createdAt: '2025-01-08T10:30:00Z',
    ticketNumber: '#001234',
    status: 'completed',
  },
  {
    id: '2',
    items: [],
    subtotal: 128.50,
    discount: 10,
    total: 115.65,
    paymentMethod: 'clip',
    paymentStatus: 'confirmed',
    branchId: '1',
    userId: '3',
    createdAt: '2025-01-08T09:45:00Z',
    ticketNumber: '#001233',
    status: 'completed',
  },
  {
    id: '3',
    items: [],
    subtotal: 89.00,
    discount: 0,
    total: 89.00,
    paymentMethod: 'mercadopago',
    paymentStatus: 'confirmed',
    branchId: '1',
    userId: '3',
    createdAt: '2025-01-08T09:15:00Z',
    ticketNumber: '#001232',
    status: 'cancelled',
    cancellationReason: 'Cliente solicitó cancelación',
  },
  {
    id: '4',
    items: [],
    subtotal: 234.75,
    discount: 0,
    total: 234.75,
    paymentMethod: 'cash',
    paymentStatus: 'confirmed',
    branchId: '1',
    userId: '3',
    createdAt: '2025-01-08T08:30:00Z',
    ticketNumber: '#001231',
    status: 'refunded',
    refundReason: 'Producto defectuoso',
  },
  {
    id: '5',
    items: [],
    subtotal: 567.00,
    discount: 5,
    total: 538.65,
    paymentMethod: 'clip',
    paymentStatus: 'pending',
    branchId: '1',
    userId: '3',
    createdAt: '2025-01-08T08:00:00Z',
    ticketNumber: '#001230',
    status: 'completed',
  },
];

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  clip: 'Clip',
  mercadopago: 'Mercado Pago',
};

export default function Sales() {
  const { user, hasPermission } = useAuth();
  const [sales] = useState<Sale[]>(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [reason, setReason] = useState('');

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="active">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="inactive">Cancelada</Badge>;
      case 'refunded':
        return <Badge variant="warning">Devuelta</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Sale['paymentStatus']) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="active">Confirmado</Badge>;
      case 'pending':
        return <Badge variant="pending">Pendiente</Badge>;
      case 'error':
        return <Badge variant="inactive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCancel = (sale: Sale) => {
    setSelectedSale(sale);
    setReason('');
    setShowCancelDialog(true);
  };

  const handleRefund = (sale: Sale) => {
    setSelectedSale(sale);
    setReason('');
    setShowRefundDialog(true);
  };

  const confirmCancel = () => {
    if (!reason.trim()) return;
    // API call would go here
    console.log('Cancelling sale', selectedSale?.id, 'with reason:', reason);
    setShowCancelDialog(false);
    setSelectedSale(null);
    setReason('');
  };

  const confirmRefund = () => {
    if (!reason.trim()) return;
    // API call would go here
    console.log('Refunding sale', selectedSale?.id, 'with reason:', reason);
    setShowRefundDialog(false);
    setSelectedSale(null);
    setReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historial de Ventas</h1>
          <p className="text-muted-foreground">
            {hasPermission(['OWNER', 'ADMINISTRADOR'])
              ? 'Todas las ventas de la sucursal'
              : 'Tus ventas realizadas'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'Todos los estados' : statusFilter}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              Todos los estados
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
              Completadas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
              Canceladas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('refunded')}>
              Devueltas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sales table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método de pago</TableHead>
                <TableHead>Estado pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <span className="font-medium">{sale.ticketNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sale.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {paymentMethodLabels[sale.paymentMethod]}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(sale.paymentStatus)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${sale.total.toFixed(2)}
                    {sale.discount > 0 && (
                      <span className="block text-xs text-status-active">
                        -{sale.discount}% desc.
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="w-4 h-4 mr-2" />
                          Reimprimir ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Generar factura
                        </DropdownMenuItem>
                        {sale.status === 'completed' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleCancel(sale)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar venta
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-warning"
                              onClick={() => handleRefund(sale)}
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Registrar devolución
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron ventas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar venta</DialogTitle>
            <DialogDescription>
              Estás por cancelar la venta {selectedSale?.ticketNumber}. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cancel-reason">Motivo de cancelación (obligatorio)</Label>
            <Textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo de la cancelación..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={!reason.trim()}
            >
              Cancelar venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar devolución</DialogTitle>
            <DialogDescription>
              Registra una devolución para la venta {selectedSale?.ticketNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="refund-reason">Motivo de devolución (obligatorio)</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo de la devolución..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Volver
            </Button>
            <Button
              variant="warning"
              onClick={confirmRefund}
              disabled={!reason.trim()}
            >
              Registrar devolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
