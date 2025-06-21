
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const savedUser = localStorage.getItem('pachegar_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simular login - aceita qualquer email/senha para demonstração
    if (email && password) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
      };
      setUser(mockUser);
      localStorage.setItem('pachegar_user', JSON.stringify(mockUser));
      return { error: null };
    }
    return { error: { message: 'Email e senha são obrigatórios' } };
  };

  const signUp = async (email: string, password: string) => {
    // Simular cadastro - aceita qualquer email/senha para demonstração
    if (email && password) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
      };
      setUser(mockUser);
      localStorage.setItem('pachegar_user', JSON.stringify(mockUser));
      return { error: null };
    }
    return { error: { message: 'Email e senha são obrigatórios' } };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('pachegar_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
