import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  User,
  Business,
  Subscription,
  Branch,
  UserRole,
  AuthContextType
} from '@/types';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const mockUsers: Record<UserRole, User> = {
  OWNER: {
    id: '1',
    email: 'owner@demo.com',
    name: 'Carlos Mendoza',
    role: 'OWNER',
  },
  ADMINISTRADOR: {
    id: '2',
    email: 'admin@demo.com',
    name: 'María García',
    role: 'ADMINISTRADOR',
  },
  CAJERO: {
    id: '3',
    email: 'cajero@demo.com',
    name: 'Juan López',
    role: 'CAJERO',
  },
};

const mockBusiness: Business = {
  id: '1',
  name: 'Mi Tienda S.A. de C.V.',
  shortName: 'Mi Tienda',
  logo: undefined,
};

const mockSubscription: Subscription = {
  id: '1',
  status: 'active',
  plan: 'Professional',
  expiresAt: '2025-12-31',
  credits: 150,
};

const mockBranches: Branch[] = [
  { id: '1', name: 'Sucursal Centro', address: 'Av. Principal #123', isActive: true, businessId: '1' },
  { id: '2', name: 'Sucursal Norte', address: 'Calle Norte #456', isActive: true, businessId: '1' },
  { id: '3', name: 'Sucursal Sur', address: 'Av. Sur #789', isActive: false, businessId: '1' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pos_user');
    const storedRole = localStorage.getItem('pos_demo_role') as UserRole | null;
    
    if (storedUser && storedRole) {
      const parsedUser = mockUsers[storedRole];
      setUser(parsedUser);
      setBusiness(mockBusiness);
      setSubscription(mockSubscription);
      setBranches(mockBranches);
      setActiveBranchState(mockBranches[0]);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo: determine role from email
    let role: UserRole = 'CAJERO';
    if (email.includes('owner')) role = 'OWNER';
    else if (email.includes('admin')) role = 'ADMINISTRADOR';
    
    const loggedUser = mockUsers[role];
    
    localStorage.setItem('pos_user', JSON.stringify(loggedUser));
    localStorage.setItem('pos_demo_role', role);
    localStorage.setItem('pos_token', 'demo_token_' + Date.now());
    
    setUser(loggedUser);
    setBusiness(mockBusiness);
    setSubscription(mockSubscription);
    setBranches(mockBranches);
    setActiveBranchState(mockBranches[0]);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('pos_user');
    localStorage.removeItem('pos_demo_role');
    localStorage.removeItem('pos_token');
    setUser(null);
    setBusiness(null);
    setSubscription(null);
    setBranches([]);
    setActiveBranchState(null);
  };

  const setActiveBranch = (branch: Branch) => {
    if (branch.isActive) {
      setActiveBranchState(branch);
    }
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const isSubscriptionActive = (): boolean => {
    if (!subscription) return false;
    return subscription.status === 'active' || subscription.status === 'trial';
  };

  const isBranchActive = (): boolean => {
    if (!activeBranch) return false;
    return activeBranch.isActive;
  };

  const value: AuthContextType = {
    user,
    business,
    subscription,
    activeBranch,
    branches,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setActiveBranch,
    hasPermission,
    isSubscriptionActive,
    isBranchActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}