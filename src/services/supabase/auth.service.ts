import { Session, User, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './client';
import { env } from '@/config/env';
import { LoginCredentials, AdminProfile, AdminRole } from '@/types';

/**
 * Supabase Authentication & Role Verification Service.
 * Implements server-side verified admin checks via database RPC and RLS.
 */
export const authService = {
  /**
   * Authenticate administrator via email and password against Supabase Auth.
   */
  async signIn({ email, password }: LoginCredentials): Promise<{
    user: User | null;
    session: Session | null;
    profile: AdminProfile | null;
    error: AuthError | Error | null;
  }> {
    if (!env.isSupabaseConfigured) {
      const configurationError = new Error(
        'Supabase is not configured. Please supply valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.'
      );
      return { user: null, session: null, profile: null, error: configurationError as unknown as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { user: null, session: null, profile: null, error };
      }

      if (!data.user) {
        return { user: null, session: null, profile: null, error: new Error('User not found.') as unknown as AuthError };
      }

      // Verify that this user is actually an active administrator in admin_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', data.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (profileError || !profileData) {
        // Sign out immediately if user is authenticated in Supabase Auth but not authorized in admin_profiles
        await supabase.auth.signOut();
        return {
          user: null,
          session: null,
          profile: null,
          error: new Error('Unauthorized: This account does not possess active administrative access privileges.') as unknown as AuthError,
        };
      }

      return {
        user: data.user,
        session: data.session,
        profile: profileData as unknown as AdminProfile,
        error: null,
      };
    } catch (err) {
      return {
        user: null,
        session: null,
        profile: null,
        error: err instanceof Error ? (err as unknown as AuthError) : new Error('An unexpected auth error occurred') as unknown as AuthError,
      };
    }
  },

  /**
   * Terminate administrator session.
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return {
        error: err as unknown as AuthError,
      };
    }
  },

  /**
   * Retrieve current active session if one exists in storage.
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (err) {
      return { session: null, error: err as unknown as AuthError };
    }
  },

  /**
   * Fetch current authenticated user from Supabase.
   */
  async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (err) {
      return { user: null, error: err as unknown as AuthError };
    }
  },

  /**
   * Fetch admin profile for a specific user ID.
   */
  async getAdminProfile(userId: string): Promise<{ profile: AdminProfile | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { profile: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return { profile: data as unknown as AdminProfile, error: null };
    } catch (err) {
      return {
        profile: null,
        error: err instanceof Error ? err : new Error('Failed to retrieve administrator profile.'),
      };
    }
  },

  /**
   * Verify whether the currently authenticated user is an active administrator via database function.
   */
  async verifyAdminRole(): Promise<{ isAdmin: boolean; role: AdminRole | null }> {
    if (!env.isSupabaseConfigured) {
      return { isAdmin: false, role: null };
    }

    try {
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
      if (adminCheckError || !isAdmin) {
        return { isAdmin: false, role: null };
      }

      const { data: roleStr } = await supabase.rpc('get_admin_role');
      return { isAdmin: true, role: (roleStr as AdminRole) || 'staff' };
    } catch {
      return { isAdmin: false, role: null };
    }
  },

  /**
   * Subscribe to authentication state changes (login, logout, token refresh).
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
