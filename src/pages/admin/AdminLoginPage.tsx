import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { validateEmail, validateRequired } from '@/utils/validation';
import { useAnnounce } from '@/hooks/useAnnounce';
import { ROUTES } from '@/config/constants';
import { env } from '@/config/env';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const { announce } = useAnnounce();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // If already authenticated, redirect to target or dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.ADMIN.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validateRequired(password, 'Password');

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setErrors({
        email: emailValidation.error,
        password: passwordValidation.error,
      });
      announce('Form has errors. Please check the fields.', 'assertive');
      return;
    }

    setErrors({});
    announce('Attempting sign in...', 'polite');

    const result = await signIn({ email, password });
    if (result.error) {
      const message = result.error.message || 'Authentication failed. Please verify your credentials.';
      setAuthError(message);
      announce(message, 'assertive');
    } else {
      announce('Sign in successful. Redirecting to admin dashboard.', 'polite');
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    }
  };

  return (
    <div
      style={{
        maxWidth: '440px',
        margin: '60px auto',
        padding: '0 16px',
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
          OM OPEN MINDS — Admin Portal
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Administrative access for authorized school personnel.
        </p>
      </header>

      {!env.isSupabaseConfigured && (
        <div
          role="note"
          style={{
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            color: '#92400e',
            fontSize: '13px',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}
        >
          <strong>Configuration Notice:</strong> Supabase credentials are not yet configured in <code>.env</code>.
          Real sign-ins require verified Supabase Auth accounts.
        </div>
      )}

      {authError && <ErrorMessage message={authError} />}

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="admin-email"
            type="email"
            label="Administrator Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
            placeholder="admin@omopenminds.example"
          />

          <Input
            id="admin-password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Sign In to Dashboard
          </Button>
        </form>
      </Card>

      <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <p style={{ margin: 0 }}>
          Protected portal. Unauthorized access attempts are monitored and recorded.
        </p>
      </footer>
    </div>
  );
};

