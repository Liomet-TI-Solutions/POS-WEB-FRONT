// User roles
export type UserRole = 'OWNER' | 'ADMINISTRADOR' | 'CAJERO';

// Subscription status
export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'pending';

// Payment status
export type PaymentStatus = 'pending' | 'confirmed' | 'error';

// Payment method
export type PaymentMethod = 'cash' | 'clip' | 'mercadopago';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Branch interface
export interface Branch {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  businessId: string;
}

// Business interface
export interface Business {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
}

// Subscription interface
export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  plan: string;
  expiresAt: string;
  credits: number;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  barcode?: string;
  stock: number;
  isActive: boolean;
  categoryId?: string;
  category?: string;
  image?: string;
  attributes?: ProductAttribute[];
  labels?: string[];
}

// Product attribute for dynamic attributes
export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

// Cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Sale interface
export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  branchId: string;
  userId: string;
  createdAt: string;
  ticketNumber: string;
  invoiceNumber?: string;
  status: 'completed' | 'cancelled' | 'refunded';
  cancellationReason?: string;
  refundReason?: string;
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
  entityType: string;
  entityId?: string;
}

// Navigation item
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  children?: NavItem[];
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  business: Business | null;
  subscription: Subscription | null;
  activeBranch: Branch | null;
  branches: Branch[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setActiveBranch: (branch: Branch) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isSubscriptionActive: () => boolean;
  isBranchActive: () => boolean;
}
