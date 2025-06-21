import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateEmail: (newEmail: string) => Promise<{ error: any }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Se o usuário acabou de fazer login via link de recuperação, redirecionar para configurações
        if (event === 'SIGNED_IN' && session?.user && window.location.hash.includes('type=recovery')) {
          window.location.href = '/configuracoes';
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    console.log('Attempting sign in with:', email, 'Remember me:', rememberMe);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Se "Remember me" não estiver marcado, configurar sessão para expirar mais cedo
    if (!rememberMe && data.session) {
      // Configurar para sessão mais curta (1 dia em vez do padrão)
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        ...data.session,
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 1 dia
      }));
    }

    console.log('Sign in result:', { data, error });
    setLoading(false);
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up with:', email);
    setLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    console.log('Sign up result:', { data, error });
    setLoading(false);
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    console.log('Attempting password reset for:', email);
    setLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    console.log('Password reset result:', { error });
    setLoading(false);
    
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    console.log('Attempting to update password');
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    console.log('Password update result:', { error });
    setLoading(false);
    
    return { error };
  };

  const updateEmail = async (newEmail: string) => {
    console.log('Attempting to update email to:', newEmail);
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    console.log('Email update result:', { error });
    setLoading(false);
    
    return { error };
  };

  const signOut = async () => {
    console.log('Signing out');
    setLoading(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setUser(null);
      setSession(null);
    }
    
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
