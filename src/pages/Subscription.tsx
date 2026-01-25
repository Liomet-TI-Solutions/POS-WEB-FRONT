import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  CreditCard,
  Zap,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 299,
    features: ['1 sucursal', '2 usuarios', 'Soporte por email'],
    current: false,
  },
  {
    id: 'professional',
    name: 'Profesional',
    price: 599,
    features: ['5 sucursales', '10 usuarios', 'Soporte prioritario', 'Reportes avanzados'],
    current: true,
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 999,
    features: ['Sucursales ilimitadas', 'Usuarios ilimitados', 'Soporte 24/7', 'API access'],
    current: false,
  },
];

export default function Subscription() {
  const { subscription } = useAuth();

  const daysRemaining = subscription
    ? Math.ceil(
        (new Date(subscription.expiresAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const usagePercentage = 65; // Mock usage

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suscripción</h1>
        <p className="text-muted-foreground">Administra tu plan y facturación</p>
      </div>

      {/* Current subscription status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-status-active/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-status-active" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Plan {subscription?.plan}</h2>
                  <Badge variant="active">Activo</Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Tu suscripción está activa y funcionando correctamente
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Vence: {new Date(subscription?.expiresAt || '').toLocaleDateString('es-MX')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-status-active font-medium">{daysRemaining} días restantes</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Cancelar plan</Button>
              <Button>Renovar ahora</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Sucursales</span>
              <span className="text-sm font-bold">3 / 5</span>
            </div>
            <Progress value={60} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Usuarios</span>
              <span className="text-sm font-bold">5 / 10</span>
            </div>
            <Progress value={50} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Transacciones</span>
              <span className="text-sm font-bold">1,234 / 5,000</span>
            </div>
            <Progress value={25} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Available plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Planes disponibles</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.recommended ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">
                    <Crown className="w-3 h-3 mr-1" />
                    Recomendado
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-status-active" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? 'outline' : 'default'}
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? 'Plan actual' : 'Seleccionar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
