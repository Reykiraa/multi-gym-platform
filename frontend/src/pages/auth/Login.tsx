// src/pages/auth/Login.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types/auth';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Role → route mapping
// ---------------------------------------------------------------------------

/** Maps each role to its post-login destination. */
const ROLE_REDIRECT: Record<Role, string> = {
  admin: '/admin/dashboard',
  mitra: '/mitra/dashboard',
  user: '/user/discovery',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Login page — wires the existing FE1 UI to Zustand authStore and
 * performs role-based redirects using react-router-dom.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values.email, values.password);

      // Read the freshly-set user from the store via the closure re-render.
      // We re-read from the store after await to ensure the state is committed.
      const updatedUser = useAuthStore.getState().user;
      const destination = updatedUser
        ? ROLE_REDIRECT[updatedUser.role as Role]
        : '/';

      navigate(destination, { replace: true });
    } catch {
      // Guard against unexpected mock failures.
      setError('root', { message: 'Login gagal. Silakan coba lagi.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white tracking-widest">
            GYMNOX
          </Link>
          <p className="text-zinc-400 mt-2">Masuk ke akun Anda</p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            {/* Root-level error (unexpected failures) */}
            {errors.root && (
              <p className="text-sm text-rose-500 text-center">{errors.root.message}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input
                id="login-email"
                type="email"
                placeholder="contoh@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-yellow-500 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
