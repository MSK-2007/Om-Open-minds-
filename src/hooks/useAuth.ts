import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '@/app/AuthContext';

/**
 * Custom hook to access authentication context throughout the application.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
