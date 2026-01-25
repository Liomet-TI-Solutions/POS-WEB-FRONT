import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock stats data
const ownerStats = [
  { title: 'Ventas del día', value: '$12,450', change: '+12%', trend: 'up', icon: DollarSign },
  { title: 'Transacciones', value: '48', change: '+8%', trend: 'up', icon: ShoppingCart },
  { title: 'Productos activos', value: '234', change: '+3', trend: 'up', icon: Package },
  { title: 'Sucursales activas', value: '3', change: '0', trend: 'neutral', icon: MapPin },
];

const adminStats = [
  { title: 'Ventas del día', value: '$12,450', change: '+12%', trend: 'up', icon: DollarSign },
  { title: 'Transacciones', value: '48', change: '+8%', trend: 'up', icon: ShoppingCart },
  { title: 'Productos activos', value: '234', change: '+3', trend: 'up', icon: Package },
];

const cashierStats = [
  { title: 'Mis ventas hoy', value: '$3,240', change: '+5%', trend: 'up', icon: DollarSign },
  { title: 'Transacciones', value: '15', change: '+2', trend: 'up', icon: Receipt },
];

const recentSales = [
  { id: '1', ticket: '#001234', amount: 450.00, items: 3, time: 'Hace 5 min' },
  { id: '2', ticket: '#001233', amount: 128.50, items: 2, time: 'Hace 12 min' },
  { id: '3', ticket: '#001232', amount: 89.00, items: 1, time: 'Hace 25 min' },
  { id: '4', ticket: '#001231', amount: 234.75, items: 4, time: 'Hace 32 min' },
  { id: '5', ticket: '#001230', amount: 567.00, items: 6, time: 'Hace 45 min' },
];

const topProducts = [
  { name: 'Coca Cola 600ml', sold: 45, revenue: 675 },
  { name: 'Sabritas Original', sold: 38, revenue: 342 },
  { name: 'Pan Bimbo Grande', sold: 32, revenue: 896 },
  { name: 'Leche Lala 1L', sold: 28, revenue: 560 },
  { name: 'Huevo 12 pzas', sold: 25, revenue: 875 },
];

export default function Dashboard() {
  const { user, hasPermission, activeBranch } = useAuth();

  const stats = hasPermission(['OWNER'])
    ? ownerStats
    : hasPermission(['ADMINISTRADOR'])
    ? adminStats
    : cashierStats;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            ¡Hola, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {activeBranch?.name} • {new Date().toLocaleDateString('es-MX', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button asChild size="lg" className="shadow-sm">
          <Link to="/pos">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ir a Punto de Venta
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' && (
                        <ArrowUpRight className="w-4 h-4 text-status-active" />
                      )}
                      {stat.trend === 'down' && (
                        <ArrowDownRight className="w-4 h-4 text-status-inactive" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === 'up'
                            ? 'text-status-active'
                            : stat.trend === 'down'
                            ? 'text-status-inactive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs ayer
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sales */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventas recientes</CardTitle>
              <CardDescription>
                Últimas transacciones realizadas
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/sales">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sale.ticket}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.items} artículos • {sale.time}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${sale.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top products - only for OWNER and ADMIN */}
        {hasPermission(['OWNER', 'ADMINISTRADOR']) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Productos top</CardTitle>
                <CardDescription>Más vendidos hoy</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/reports">Ver reportes</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} vendidos
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${product.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick actions for cashier */}
        {hasPermission(['CAJERO']) && !hasPermission(['OWNER', 'ADMINISTRADOR']) && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Accesos directos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/pos">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Nueva venta
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/sales">
                  <Receipt className="w-4 h-4 mr-2" />
                  Ver mis ventas
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
