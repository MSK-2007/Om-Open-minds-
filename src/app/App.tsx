import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { router } from './router';

/**
 * Root Application Component.
 * Establishes top-level providers: Authentication and Routing.
 */
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
