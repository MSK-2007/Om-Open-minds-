import { createContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { LoginCredentials } from '@/types/auth.types';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

