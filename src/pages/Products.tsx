import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Barcode,
  Package,
  ChevronDown,
} from 'lucide-react';
import BarcodeGenerator from "react-barcode";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import type { Product, ProductAttribute } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca Cola 600ml',
    sku: 'BEB-001',
    price: 18.00,
    stock: 50,
    isActive: true,
    category: 'Bebidas',
    barcode: '7501055300129',
    image: 'products/coca-cola.jpeg',
    attributes: [
      { id: '1-1', name: 'Marca', value: 'Coca-Cola' },
      { id: '1-2', name: 'Contenido', value: '600ml' },
      { id: '1-3', name: 'Tipo', value: 'Refresco' },
      { id: '1-4', name: 'Presentación', value: 'Botella PET' },
    ],
  },
  {
    id: '2',
    name: 'Pepsi 600ml',
    sku: 'BEB-002',
    price: 17.00,
    stock: 45,
    isActive: true,
    category: 'Bebidas',
    barcode: '7501055300130',
    image: 'products/pepsi.jpg',
    attributes: [
      { id: '2-1', name: 'Marca', value: 'Pepsi' },
      { id: '2-2', name: 'Contenido', value: '600ml' },
      { id: '2-3', name: 'Tipo', value: 'Refresco' },
    ],
  },
  {
    id: '3',
    name: 'Sabritas Original',
    sku: 'BOT-001',
    price: 15.50,
    stock: 30,
    isActive: true,
    category: 'Botanas',
    barcode: '7501055300131',
    image: 'products/sabritas.jpg',
    attributes: [
      { id: '3-1', name: 'Marca', value: 'Sabritas' },
      { id: '3-2', name: 'Sabor', value: 'Original' },
      { id: '3-3', name: 'Peso', value: '45g' },
    ],
  },
  {
    id: '4',
    name: 'Doritos Nacho',
    sku: 'BOT-002',
    price: 18.00,
    stock: 25,
    isActive: true,
    category: 'Botanas',
    barcode: '7501055300132',
    image: 'products/doritos.jpg',
    attributes: [
      { id: '4-1', name: 'Marca', value: 'Doritos' },
      { id: '4-2', name: 'Sabor', value: 'Nacho' },
      { id: '4-3', name: 'Peso', value: '58g' },
    ],
  },
  {
    id: '5',
    name: 'Pan Bimbo Grande',
    sku: 'PAN-001',
    price: 52.00,
    stock: 20,
    isActive: true,
    category: 'Panadería',
    barcode: '7501055300133',
    image: 'products/pan-bimbo.jpg',
    attributes: [
      { id: '5-1', name: 'Marca', value: 'Bimbo' },
      { id: '5-2', name: 'Tipo', value: 'Pan blanco' },
      { id: '5-3', name: 'Contenido', value: '680g' },
    ],
  },
  {
    id: '6',
    name: 'Leche Lala 1L',
    sku: 'LAC-001',
    price: 28.00,
    stock: 35,
    isActive: true,
    category: 'Lácteos',
    barcode: '7501055300134',
    image: 'products/leche-lala.jpg',
    attributes: [
      { id: '6-1', name: 'Marca', value: 'Lala' },
      { id: '6-2', name: 'Tipo', value: 'Leche entera' },
      { id: '6-3', name: 'Contenido', value: '1L' },
    ],
  },
  {
    id: '7',
    name: 'Huevo 12 pzas',
    sku: 'BAS-001',
    price: 45.00,
    stock: 40,
    isActive: true,
    category: 'Básicos',
    barcode: '7501055300135',
    image: 'products/huevo.jpg',
    attributes: [
      { id: '7-1', name: 'Cantidad', value: '12 piezas' },
      { id: '7-2', name: 'Tipo', value: 'Blanco' },
      { id: '7-3', name: 'Tamaño', value: 'Mediano' },
    ],
  },
  {
    id: '8',
    name: 'Agua Bonafont 1L',
    sku: 'BEB-003',
    price: 14.00,
    stock: 60,
    isActive: true,
    category: 'Bebidas',
    barcode: '7501055300136',
    image: 'products/agua.jpg',
    attributes: [
      { id: '8-1', name: 'Marca', value: 'Bonafont' },
      { id: '8-2', name: 'Contenido', value: '1L' },
      { id: '8-3', name: 'Tipo', value: 'Agua natural' },
    ],
  },
  {
    id: '10',
    name: 'Atún en agua',
    sku: 'ENL-001',
    price: 24.00,
    stock: 35,
    isActive: true,
    category: 'Enlatados',
    barcode: '7501055300138',
    image: 'products/atun.jpg',
    attributes: [
      { id: '10-1', name: 'Marca', value: 'Dolores' },
      { id: '10-2', name: 'Tipo', value: 'En agua' },
      { id: '10-3', name: 'Contenido', value: '140g' },
    ],
  },
  {
    id: '11',
    name: 'Frijoles de lata',
    sku: 'ENL-002',
    price: 18.50,
    stock: 40,
    isActive: true,
    category: 'Enlatados',
    barcode: '7501055300139',
    image: 'products/frijoles.jpg',
    attributes: [
      { id: '11-1', name: 'Tipo', value: 'Bayos' },
      { id: '11-2', name: 'Presentación', value: 'Lata' },
      { id: '11-3', name: 'Contenido', value: '430g' },
    ],
  },
  {
    id: '12',
    name: 'Arroz 1kg',
    sku: 'BAS-002',
    price: 32.00,
    stock: 25,
    isActive: true,
    category: 'Básicos',
    barcode: '7501055300140',
    image: 'products/arroz.jpg',
    attributes: [
      { id: '12-1', name: 'Tipo', value: 'Grano largo' },
      { id: '12-2', name: 'Contenido', value: '1kg' },
    ],
  },
  {
    id: '13',
    name: 'Aceite 1L',
    sku: 'BAS-003',
    price: 48.00,
    stock: 20,
    isActive: true,
    category: 'Básicos',
    barcode: '7501055300141',
    image: 'products/aceite.jpg',
    attributes: [
      { id: '13-1', name: 'Tipo', value: 'Vegetal' },
      { id: '13-2', name: 'Contenido', value: '1L' },
    ],
  },
  {
    id: '14',
    name: 'Jabón Zote',
    sku: 'LIM-001',
    price: 28.00,
    stock: 30,
    isActive: true,
    category: 'Limpieza',
    barcode: '7501055300142',
    image: 'products/jabon.jpg',
    attributes: [
      { id: '14-1', name: 'Marca', value: 'Zote' },
      { id: '14-2', name: 'Uso', value: 'Ropa' },
      { id: '14-3', name: 'Peso', value: '400g' },
    ],
  },
  {
    id: '15',
    name: 'Detergente Roma',
    sku: 'LIM-002',
    price: 35.00,
    stock: 22,
    isActive: true,
    category: 'Limpieza',
    barcode: '7501055300143',
    image: 'products/detergente.jpg',
    attributes: [
      { id: '15-1', name: 'Marca', value: 'Roma' },
      { id: '15-2', name: 'Presentación', value: 'Polvo' },
      { id: '15-3', name: 'Peso', value: '1kg' },
    ],
  },
  {
    id: '16',
    name: 'Producto sin stock',
    sku: 'OTR-001',
    price: 10.00,
    stock: 0,
    isActive: true,
    category: 'Otros',
    barcode: '0000000000000',
    image: '',
    attributes: [{ id: '16-1', name: 'Estado', value: 'Sin stock' }],
  },
  {
    id: '17',
    name: 'Manzana Roja',
    sku: 'BAS-004',
    price: 0,
    stock: 100,
    isActive: true,
    category: 'Básicos',
    barcode: '7500000000001',
    image: 'products/manzana.jpg',
    isWeighted: true,
    pricePerKg: 38.00,
    attributes: [
      { id: '17-1', name: 'Tipo', value: 'Red Delicious' },
      { id: '17-2', name: 'Origen', value: 'Chihuahua' },
      { id: '17-3', name: 'Venta', value: 'Por kilo' },
    ],
  },
];




const categories = ['Todos', 'Bebidas', 'Botanas', 'Panadería', 'Lácteos', 'Básicos', 'Galletas', 'Enlatados', 'Limpieza', 'Otros'];

export default function Products() {
  const { hasPermission } = useAuth();
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [isWeighted, setIsWeighted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);


  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.barcode?.includes(query) ||
      product.attributes?.some(
        (attr) =>
          attr.name.toLowerCase().includes(query) ||
          attr.value.toLowerCase().includes(query)
      );

    const matchesCategory =
      selectedCategory === 'Todos' ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  const addAttribute = () => {
    setAttributes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        value: '',
      },
    ]);
  };

  const updateAttribute = (
    id: string,
    field: 'name' | 'value',
    value: string
  ) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.id === id ? { ...attr, [field]: value } : attr
      )
    );
  };

  const removeAttribute = (id: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu catálogo de productos</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo producto
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] flex flex-col">
            {/* HEADER */}
            <DialogHeader>
              <DialogTitle>Crear producto</DialogTitle>
              <DialogDescription>
                Agrega un nuevo producto a tu catálogo
              </DialogDescription>
            </DialogHeader>

            {/* BODY CON SCROLL */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-1">
              <div className="grid gap-4 py-4">
                {/* Nombre */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del producto</Label>
                  <Input id="name" placeholder="Ej. Coca Cola 600ml" />
                </div>

                {/* Imagen */}
                <div className="grid gap-2">
                  <Label>Imagen del producto (opcional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o WebP. Máx. recomendado 1MB
                  </p>
                </div>

                {/* Tipo de venta */}
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="isWeighted">Se vende por peso (kg)</Label>
                  <Switch
                    id="isWeighted"
                    checked={isWeighted}
                    onCheckedChange={setIsWeighted}
                  />
                </div>

                {/* Precio / Precio por kilo / Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">
                      {isWeighted ? 'Precio por kilo ($)' : 'Precio ($)'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="stock">
                      {isWeighted ? 'Stock disponible (kg)' : 'Stock'}
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      step={isWeighted ? '0.01' : '1'}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* SKU / Barcode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="Ej. BEB-001" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="barcode">Código de barras</Label>
                    <Input id="barcode" placeholder="Escanear o escribir" />
                  </div>
                </div>

                {/* Categoría */}
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categories.filter(c => c !== 'Todos').map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del producto (opcional)"
                    rows={3}
                  />
                </div>

                {/* Estado */}
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="active">Producto activo</Label>
                  <Switch id="active" defaultChecked />
                </div>

                {/* ATRIBUTOS DINÁMICOS */}
                <div className="grid gap-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Atributos del producto</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addAttribute}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>

                  {attributes.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Ejemplos: Tamaño, Color, Sabor, Material
                    </p>
                  )}

                  {attributes.map(attr => (
                    <div key={attr.id} className="flex gap-2">
                      <Input
                        placeholder="Nombre (ej. Tamaño)"
                        value={attr.name}
                        onChange={(e) =>
                          updateAttribute(attr.id, 'name', e.target.value)
                        }
                      />
                      <Input
                        placeholder="Valor (ej. 600ml)"
                        value={attr.value}
                        onChange={(e) =>
                          updateAttribute(attr.id, 'value', e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER FIJO */}
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Crear producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-active/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-status-active" />
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
              <div className="w-10 h-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
                <p className="text-xs text-muted-foreground">Stock bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-inactive/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-status-inactive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
                <p className="text-xs text-muted-foreground">Sin stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, SKU o código de barras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {selectedCategory}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Atributos</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.barcode && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Barcode className="w-3 h-3" />
                            {product.barcode}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.isWeighted
                      ? `$${product.pricePerKg?.toFixed(2)} / kg`
                      : `$${product.price.toFixed(2)}`
                    }
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock === 0
                          ? 'inactive'
                          : product.stock < 10
                            ? 'warning'
                            : 'active'
                      }
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'active' : 'inactive'}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {product.attributes?.map((attr) => (
                        <span
                          key={attr.id}
                          className="text-xs bg-muted px-2 py-1 rounded-md"
                        >
                          {attr.name}: {attr.value}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowBarcodeDialog(true);
                          }}
                        >
                          <Barcode className="w-4 h-4 mr-2" />
                          Imprimir código
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron productos</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showBarcodeDialog} onOpenChange={setShowBarcodeDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Código de barras</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct?.barcode && (
            <div className="flex flex-col items-center gap-4 py-6">
              <BarcodeGenerator
                value={selectedProduct.barcode}
                format="EAN13"
                width={2}
                height={80}
                displayValue={true}
              />

              <p className="text-sm text-muted-foreground">
                SKU: {selectedProduct.sku}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBarcodeDialog(false)}>
              Cerrar
            </Button>
            <Button
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
