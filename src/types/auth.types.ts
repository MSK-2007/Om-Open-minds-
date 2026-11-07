import { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * Authentication state for the application.
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Admin login credentials.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication service contract.
 */
export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  signOut(): Promise<{ error: AuthError | null }>;
  getSession(): Promise<{ session: Session | null; error: AuthError | null }>;
  getUser(): Promise<{ user: User | null; error: AuthError | null }>;
}

