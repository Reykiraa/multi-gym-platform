import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await apiClient.post('/auth/login', { 
        email: values.email, 
        password: values.password 
      });
      const user = response.data.user;
      setAuth(user, response.data.token);
      
      // Role-based smart redirect
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'mitra') {
        navigate('/mitra/dashboard');
      } else {
        navigate('/user/gyms');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('root', { message: 'Login gagal. Silakan periksa email dan password Anda.' });
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
