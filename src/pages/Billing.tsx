import { useState } from 'react';
import {
  CreditCard,
  Plus,
  Receipt,
  Download,
  Package,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const creditPackages = [
  { id: '1', name: 'Paquete Básico', credits: 100, price: 199, popular: false },
  { id: '2', name: 'Paquete Estándar', credits: 250, price: 449, popular: true },
  { id: '3', name: 'Paquete Premium', credits: 500, price: 799, popular: false },
];

const paymentHistory = [
  {
    id: '1',
    date: '2025-01-01',
    description: 'Renovación mensual - Plan Profesional',
    amount: 599,
    status: 'paid',
    invoice: 'INV-2025-001',
  },
  {
    id: '2',
    date: '2024-12-15',
    description: 'Compra de créditos - 250 créditos',
    amount: 449,
    status: 'paid',
    invoice: 'INV-2024-052',
  },
  {
    id: '3',
    date: '2024-12-01',
    description: 'Renovación mensual - Plan Profesional',
    amount: 599,
    status: 'paid',
    invoice: 'INV-2024-048',
  },
  {
    id: '4',
    date: '2024-11-01',
    description: 'Renovación mensual - Plan Profesional',
    amount: 599,
    status: 'paid',
    invoice: 'INV-2024-035',
  },
];

export default function Billing() {
  const { subscription } = useAuth();
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Facturación SaaS</h1>
        <p className="text-muted-foreground">Gestiona tus créditos y pagos</p>
      </div>

      {/* Credits summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créditos disponibles</p>
                <p className="text-4xl font-bold mt-2">{subscription?.credits || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Para generación de facturas
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créditos usados este mes</p>
                <p className="text-4xl font-bold mt-2">45</p>
                <p className="text-sm text-muted-foreground mt-1">
                  45 facturas generadas
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                <Receipt className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buy credits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Comprar créditos</CardTitle>
            <CardDescription>
              Adquiere paquetes de créditos para generar facturas
            </CardDescription>
          </div>
          <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Comprar créditos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Comprar paquete de créditos</DialogTitle>
                <DialogDescription>
                  Selecciona el paquete que mejor se adapte a tus necesidades
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                {creditPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative flex items-center justify-between p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedPackage === pkg.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 right-4" variant="default">
                        Popular
                      </Badge>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.credits} créditos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${pkg.price}</p>
                      <p className="text-xs text-muted-foreground">
                        ${(pkg.price / pkg.credits).toFixed(2)}/crédito
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBuyCreditsDialog(false)}>
                  Cancelar
                </Button>
                <Button disabled={!selectedPackage}>
                  Proceder al pago
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-4 rounded-lg border ${
                  pkg.popular ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 right-4" variant="default">
                    Popular
                  </Badge>
                )}
                <div className="text-center">
                  <p className="font-semibold">{pkg.name}</p>
                  <p className="text-3xl font-bold mt-2">{pkg.credits}</p>
                  <p className="text-sm text-muted-foreground">créditos</p>
                  <p className="text-xl font-bold mt-3">${pkg.price}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>
            Registro de todos tus pagos y facturas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatDate(payment.date)}
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.invoice}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'paid' ? 'active' : 'pending'}>
                      {payment.status === 'paid' ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Pagado</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Pendiente</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
