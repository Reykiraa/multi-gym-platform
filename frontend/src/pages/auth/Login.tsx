import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();
  
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
      setError('root', { message: 'Login failed. Please check your email and password.' });
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsGoogleLoading(true);
    try {
      const response = await apiClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      const { user, token } = response.data;
      setAuth(user, token);
      addToast('success', `Welcome, ${user.name}!`);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'mitra') {
        navigate('/mitra/dashboard');
      } else {
        navigate('/user/gyms');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      addToast('error', axiosError.response?.data?.message || 'Google Sign-In failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {isGoogleLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Menghubungkan Akun Google</h3>
          <p className="text-sm text-zinc-400">Sedang memverifikasi data dan menyiapkan dashboard RoamFit Anda...</p>
        </div>
      )}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white tracking-widest">
            ROAM<span className="text-yellow-500">FIT</span>
          </Link>
          <p className="text-zinc-400 mt-2">Sign in to your account</p>
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
                placeholder="e.g., jane@email.com" 
                error={errors.email?.message}
                {...register('email')} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input 
                id="login-password"
                type="password" 
                placeholder="Min. 8 characters" 
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
              {isSubmitting ? 'Processing...' : 'Sign In'}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              or
            </span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => addToast('error', 'Failed to load Google Sign-In')}
              theme="filled_black"
              shape="pill"
              width="100%"
            />
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-500 hover:underline">
              Sign up now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
