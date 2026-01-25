import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for reports
const salesByDate = [
  { date: '2025-01-08', sales: 45, revenue: 12450 },
  { date: '2025-01-07', sales: 52, revenue: 14230 },
  { date: '2025-01-06', sales: 38, revenue: 9870 },
  { date: '2025-01-05', sales: 41, revenue: 11200 },
  { date: '2025-01-04', sales: 63, revenue: 18540 },
  { date: '2025-01-03', sales: 55, revenue: 15890 },
  { date: '2025-01-02', sales: 47, revenue: 13210 },
];

const salesByBranch = [
  { branch: 'Sucursal Centro', sales: 156, revenue: 42350, percentage: 45 },
  { branch: 'Sucursal Norte', sales: 98, revenue: 28760, percentage: 30 },
  { branch: 'Sucursal Poniente', sales: 87, revenue: 24280, percentage: 25 },
];

const topProducts = [
  { name: 'Coca Cola 600ml', sold: 245, revenue: 4410 },
  { name: 'Pan Bimbo Grande', sold: 189, revenue: 9828 },
  { name: 'Leche Lala 1L', sold: 167, revenue: 4676 },
  { name: 'Huevo 12 pzas', sold: 145, revenue: 6525 },
  { name: 'Sabritas Original', sold: 134, revenue: 2077 },
  { name: 'Agua Bonafont 1L', sold: 128, revenue: 1792 },
  { name: 'Pepsi 600ml', sold: 112, revenue: 1904 },
  { name: 'Doritos Nacho', sold: 98, revenue: 1764 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const totalRevenue = salesByDate.reduce((sum, day) => sum + day.revenue, 0);
  const totalSales = salesByDate.reduce((sum, day) => sum + day.sales, 0);
  const avgTicket = totalRevenue / totalSales;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">Análisis de ventas y productos</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-44">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sucursal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sucursales</SelectItem>
              <SelectItem value="1">Sucursal Centro</SelectItem>
              <SelectItem value="2">Sucursal Norte</SelectItem>
              <SelectItem value="4">Sucursal Poniente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos totales</p>
                <p className="text-3xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-status-active" />
                  <span className="text-sm text-status-active">+12.5%</span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-status-active/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-status-active" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de ventas</p>
                <p className="text-3xl font-bold mt-1">{totalSales}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-status-active" />
                  <span className="text-sm text-status-active">+8.3%</span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket promedio</p>
                <p className="text-3xl font-bold mt-1">${avgTicket.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-status-active" />
                  <span className="text-sm text-status-active">+4.2%</span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by date */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por fecha</CardTitle>
            <CardDescription>Resumen de ventas diarias</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByDate.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                    <TableCell className="text-right">{day.sales}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${day.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales by branch */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por sucursal</CardTitle>
            <CardDescription>Distribución de ventas por ubicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByBranch.map((branch) => (
                <div key={branch.branch} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{branch.branch}</span>
                    <span className="text-sm text-muted-foreground">
                      {branch.sales} ventas
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${branch.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-20 text-right">
                      ${branch.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Productos más vendidos</CardTitle>
            <CardDescription>Top productos por unidades vendidas</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Vendidos</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product.name}>
                  <TableCell>
                    <Badge
                      variant={index < 3 ? 'default' : 'secondary'}
                      className="w-8 justify-center"
                    >
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{product.sold}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${product.revenue.toLocaleString()}
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
