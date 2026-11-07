import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { authService } from '@/services/supabase/auth.service';
import { LoginCredentials } from '@/types/auth.types';
import { AdminProfile } from '@/types/database.types';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { profile: adminProfile } = await authService.getAdminProfile(userId);
      setProfile(adminProfile);
    } catch {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

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
          if (currentSession?.user?.id) {
            await loadProfile(currentSession.user.id);
          }
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

    const { data: authSubscription } = authService.onAuthStateChange(async (_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user?.id) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    const { user: authedUser, session: authedSession, profile: authedProfile, error: authError } = await authService.signIn(credentials);
    if (authError) {
      setError(authError);
      setIsLoading(false);
      return { error: authError };
    }
    setUser(authedUser);
    setSession(authedSession);
    setProfile(authedProfile);
    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        error,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
