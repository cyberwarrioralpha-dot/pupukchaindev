import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Government' | 'Producer' | 'Distributor' | 'Admin';
  organization: string;
  avatar?: string;
  lastLogin?: Date;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: { [key: string]: User } = {
  'admin@pupukchain.gov.id': {
    id: '1',
    name: 'Dr. Budi Santoso',
    email: 'admin@pupukchain.gov.id',
    role: 'Government',
    organization: 'Kementerian Pertanian RI',
    lastLogin: new Date(),
    permissions: ['read', 'write', 'admin']
  },
  'producer@pupuk.co.id': {
    id: '2',
    name: 'Ir. Siti Rahayu',
    email: 'producer@pupuk.co.id',
    role: 'Producer',
    organization: 'PT Pupuk Indonesia',
    lastLogin: new Date(),
    permissions: ['read', 'write']
  },
  'distributor@agro.co.id': {
    id: '3',
    name: 'Ahmad Hidayat',
    email: 'distributor@agro.co.id',
    role: 'Distributor',
    organization: 'CV Agro Nusantara',
    lastLogin: new Date(),
    permissions: ['read', 'write']
  },
  'admin@system.id': {
    id: '4',
    name: 'Maya Sari',
    email: 'admin@system.id',
    role: 'Admin',
    organization: 'PupukChain System',
    lastLogin: new Date(),
    permissions: ['read', 'write', 'admin', 'system']
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('pupukchain_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Validate that the user data is still valid
          if (userData && userData.id && userData.email) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('pupukchain_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers[email];
      if (user && password === '123456') { // Simple mock password
        const userWithLogin = {
          ...user,
          lastLogin: new Date()
        };
        setUser(userWithLogin);
        localStorage.setItem('pupukchain_user', JSON.stringify(userWithLogin));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pupukchain_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('pupukchain_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};