import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Barcode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Check,
  AlertTriangle,
  Camera,
  Receipt,
  FileText,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import type { Product, CartItem, PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';

// Mock products data
const mockProducts: Product[] = [
  { id: '1', name: 'Coca Cola 600ml', price: 18.00, stock: 50, isActive: true, category: 'Bebidas', barcode: '7501055300129' },
  { id: '2', name: 'Pepsi 600ml', price: 17.00, stock: 45, isActive: true, category: 'Bebidas', barcode: '7501055300130' },
  { id: '3', name: 'Sabritas Original', price: 15.50, stock: 30, isActive: true, category: 'Botanas', barcode: '7501055300131' },
  { id: '4', name: 'Doritos Nacho', price: 18.00, stock: 25, isActive: true, category: 'Botanas', barcode: '7501055300132' },
  { id: '5', name: 'Pan Bimbo Grande', price: 52.00, stock: 20, isActive: true, category: 'Panadería', barcode: '7501055300133' },
  { id: '6', name: 'Leche Lala 1L', price: 28.00, stock: 35, isActive: true, category: 'Lácteos', barcode: '7501055300134' },
  { id: '7', name: 'Huevo 12 pzas', price: 45.00, stock: 40, isActive: true, category: 'Básicos', barcode: '7501055300135' },
  { id: '8', name: 'Agua Bonafont 1L', price: 14.00, stock: 60, isActive: true, category: 'Bebidas', barcode: '7501055300136' },
  { id: '9', name: 'Galletas Marías', price: 22.00, stock: 28, isActive: true, category: 'Galletas', barcode: '7501055300137' },
  { id: '10', name: 'Atún en agua', price: 24.00, stock: 35, isActive: true, category: 'Enlatados', barcode: '7501055300138' },
  { id: '11', name: 'Frijoles de lata', price: 18.50, stock: 40, isActive: true, category: 'Enlatados', barcode: '7501055300139' },
  { id: '12', name: 'Arroz 1kg', price: 32.00, stock: 25, isActive: true, category: 'Básicos', barcode: '7501055300140' },
  { id: '13', name: 'Aceite 1L', price: 48.00, stock: 20, isActive: true, category: 'Básicos', barcode: '7501055300141' },
  { id: '14', name: 'Jabón Zote', price: 28.00, stock: 30, isActive: true, category: 'Limpieza', barcode: '7501055300142' },
  { id: '15', name: 'Detergente Roma', price: 35.00, stock: 22, isActive: true, category: 'Limpieza', barcode: '7501055300143' },
  { id: '16', name: 'Producto sin stock', price: 10.00, stock: 0, isActive: true, category: 'Otros', barcode: '0000000000000' },
];

const categories = ['Todos', 'Bebidas', 'Botanas', 'Panadería', 'Lácteos', 'Básicos', 'Galletas', 'Enlatados', 'Limpieza'];

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'cash', label: 'Efectivo', icon: Banknote },
  { id: 'clip', label: 'Clip', icon: CreditCard },
  { id: 'mercadopago', label: 'Mercado Pago', icon: Smartphone },
];

export default function POS() {
  const { user, hasPermission, activeBranch } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [cashReceived, setCashReceived] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const canApplyDiscount = hasPermission(['OWNER', 'ADMINISTRADOR']);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive;
  });

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  // Add to cart
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Handle barcode input
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    const product = mockProducts.find((p) => p.barcode === barcodeInput);
    if (product && product.isActive && product.stock > 0) {
      addToCart(product);
    }
    setBarcodeInput('');
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedPayment) return;

    setPaymentStatus('processing');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% chance) or error (10% chance)
    if (Math.random() > 0.1) {
      setPaymentStatus('success');
    } else {
      setPaymentStatus('error');
    }
  };

  // Handle successful payment
  const handlePaymentComplete = () => {
    clearCart();
    setShowPaymentDialog(false);
    setPaymentStatus('idle');
    setSelectedPayment(null);
    setCashReceived('');
  };

  // Calculate change for cash payments
  const change = selectedPayment === 'cash' && cashReceived
    ? parseFloat(cashReceived) - total
    : 0;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-4">
      {/* Products Section */}
      <div className="flex-1 flex flex-col min-w-0 lg:max-w-[60%]">
        {/* Search and filters */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Barcode input */}
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={barcodeInputRef}
                  placeholder="Código de barras"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="pl-9 w-40"
                />
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="pos-grid">
            {filteredProducts.map((product) => {
              const inCart = cart.find((item) => item.product.id === product.id);
              const isOutOfStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product)}
                  disabled={isOutOfStock}
                  className={cn(
                    'relative bg-pos-product rounded-lg border border-border p-3 text-left transition-all',
                    'hover:shadow-md hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary',
                    isOutOfStock && 'opacity-50 cursor-not-allowed',
                    inCart && 'ring-2 ring-primary'
                  )}
                >
                  {/* Stock badge */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={isOutOfStock ? 'inactive' : product.stock < 10 ? 'warning' : 'active'}
                      className="text-[10px]"
                    >
                      {isOutOfStock ? 'Sin stock' : `${product.stock}`}
                    </Badge>
                  </div>

                  {/* In cart indicator */}
                  {inCart && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {inCart.quantity}
                    </div>
                  )}

                  <div className="pt-4">
                    <p className="font-medium text-sm truncate mb-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Package className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <Card className="lg:w-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            Carrito
            {cart.length > 0 && (
              <Badge variant="secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
            )}
          </CardTitle>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart}>
              <Trash2 className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
                <p>Carrito vacío</p>
                <p className="text-xs">Agrega productos para comenzar</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => updateQuantity(item.product.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-right min-w-[60px]">
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Discount (only for OWNER and ADMIN) */}
          {canApplyDiscount && cart.length > 0 && (
            <div className="flex items-center gap-3 py-3 border-t">
              <span className="text-sm text-muted-foreground">Descuento:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-20 h-8 text-center"
                />
                <span className="text-sm">%</span>
              </div>
              {discount > 0 && (
                <span className="text-sm text-status-active">
                  -${discountAmount.toFixed(2)}
                </span>
              )}
            </div>
          )}

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-status-active">
                <span>Descuento ({discount}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay button */}
          <Button
            size="lg"
            className="w-full mt-4"
            disabled={cart.length === 0}
            onClick={() => setShowPaymentDialog(true)}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Cobrar ${total.toFixed(2)}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar pago</DialogTitle>
            <DialogDescription>
              Total a cobrar: <span className="font-bold text-foreground">${total.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === 'idle' && (
            <>
              <div className="grid gap-3 py-4">
                <p className="text-sm font-medium">Método de pago</p>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 transition-colors',
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium">{method.label}</span>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 ml-auto text-primary" />
                      )}
                    </button>
                  );
                })}

                {selectedPayment === 'cash' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">Efectivo recibido</label>
                    <Input
                      type="number"
                      min={total}
                      step="0.01"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder="0.00"
                      className="text-lg font-bold text-center"
                    />
                    {change > 0 && (
                      <p className="text-center text-lg font-bold text-status-active">
                        Cambio: ${change.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={processPayment}
                  disabled={!selectedPayment || (selectedPayment === 'cash' && (!cashReceived || change < 0))}
                >
                  Confirmar pago
                </Button>
              </DialogFooter>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Procesando pago...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-status-active/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-status-active" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">¡Pago exitoso!</p>
                <p className="text-muted-foreground">Ticket #001235</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Receipt className="w-4 h-4 mr-1" />
                  Imprimir ticket
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1" />
                  Generar factura
                </Button>
              </div>
              <Button onClick={handlePaymentComplete} className="mt-2">
                Nueva venta
              </Button>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-destructive">Error en el pago</p>
                <p className="text-muted-foreground">Por favor intenta de nuevo</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPaymentStatus('idle')}>
                  Reintentar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowPaymentDialog(false);
                    setPaymentStatus('idle');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
