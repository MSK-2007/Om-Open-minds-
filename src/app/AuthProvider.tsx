import React, { useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { authService } from '@/services/supabase/auth.service';
import { LoginCredentials } from '@/types/auth.types';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { session: currentSession, error: sessionError } = await authService.getSession();
        if (isMounted) {
          if (sessionError) {
            setError(sessionError);
          }
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to restore session'));
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: authSubscription } = authService.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    const { user: authedUser, session: authedSession, error: authError } = await authService.signIn(credentials);
    if (authError) {
      setError(authError);
      setIsLoading(false);
      return { error: authError };
    }
    setUser(authedUser);
    setSession(authedSession);
    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
