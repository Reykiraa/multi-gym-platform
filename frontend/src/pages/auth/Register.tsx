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
import TermsModal from '../../components/modals/TermsModal';

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  terms: z.literal(true, {
    message: 'Anda harus menyetujui Syarat & Ketentuan',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await apiClient.post('/auth/register', { 
        name: values.name, 
        email: values.email, 
        password: values.password,
        role: 'user'
      });
      const user = response.data.user;
      setAuth(user, response.data.token);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'mitra') {
        navigate('/mitra/dashboard', { replace: true });
      } else {
        navigate('/user/gyms', { replace: true });
      }
    } catch (error) {
      console.error('Register failed', error);
      setError('root', { message: 'Pendaftaran gagal. Silakan coba lagi.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white tracking-widest">GYMNOX</Link>
          <p className="text-zinc-400 mt-2">Daftar akun baru</p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            {errors.root && (
              <p className="text-sm text-rose-500 text-center">{errors.root.message}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nama Lengkap</label>
              <Input 
                id="register-name"
                type="text" 
                placeholder="Your Name" 
                error={errors.name?.message}
                {...register('name')} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input 
                id="register-email"
                type="email" 
                placeholder="e.g., name@email.com" 
                error={errors.email?.message}
                {...register('email')} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input 
                id="register-password"
                type="password" 
                placeholder="Min. 8 karakter" 
                error={errors.password?.message}
                {...register('password')} 
              />
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 rounded bg-zinc-800 border-zinc-700 text-yellow-500 focus:ring-yellow-500" 
                  {...register('terms')}
                />
                <label htmlFor="terms" className="text-sm text-zinc-400">
                  Saya setuju dengan <span onClick={() => setIsTermsOpen(true)} className="text-yellow-500 hover:underline cursor-pointer">Syarat & Ketentuan</span> serta Kebijakan Privasi.
                </label>
              </div>
              {errors.terms && <span className="text-xs text-rose-500">{errors.terms.message}</span>}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 mt-4" 
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Buat Akun'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Sudah punya akun? <Link to="/login" className="text-yellow-500 hover:underline">Login di sini</Link>
          </p>

          <hr className="my-4 border-zinc-800" />
          <div className="mt-4">
            <p className="text-sm text-zinc-400 text-center font-light">
              Memiliki fasilitas Gym? <a href="https://wa.me/6281315792492" className="text-yellow-500 hover:underline">Hubungi Kami</a> untuk menjadi Mitra.
            </p>
          </div>
        </Card>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};

export default Register;
