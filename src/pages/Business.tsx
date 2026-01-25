import { useState } from 'react';
import { Building2, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

export default function Business() {
  const { business } = useAuth();
  const [formData, setFormData] = useState({
    name: business?.name || '',
    shortName: business?.shortName || '',
    rfc: 'XAXX010101000',
    address: 'Av. Principal #123, Col. Centro, Ciudad, CP 12345',
    phone: '+52 123 456 7890',
    email: 'contacto@mitienda.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Datos del Negocio</h1>
        <p className="text-muted-foreground">Configura la información de tu empresa</p>
      </div>

      {/* Logo section */}
      <Card>
        <CardHeader>
          <CardTitle>Logo del negocio</CardTitle>
          <CardDescription>
            Este logo aparecerá en tickets y facturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <Building2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Subir logo
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG, JPG o SVG. Máximo 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business info */}
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
          <CardDescription>
            Datos que aparecerán en documentos fiscales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Razón social</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre legal de la empresa"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shortName">Nombre corto</Label>
            <Input
              id="shortName"
              value={formData.shortName}
              onChange={handleChange}
              placeholder="Nombre comercial o abreviado"
            />
            <p className="text-xs text-muted-foreground">
              Este nombre se mostrará en el sistema y tickets
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rfc">RFC</Label>
            <Input
              id="rfc"
              value={formData.rfc}
              onChange={handleChange}
              placeholder="RFC de la empresa"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Dirección fiscal</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección completa"
              rows={2}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 123 456 7890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
