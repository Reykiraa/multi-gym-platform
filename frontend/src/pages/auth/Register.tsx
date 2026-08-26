import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyetujui Syarat & Ketentuan' }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();

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
      // Mock register delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Navigate to login or discovery upon successful registration mock
      navigate('/user/gyms', { replace: true });
    } catch {
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
                placeholder="Budi Santoso" 
                error={errors.name?.message}
                {...register('name')} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input 
                id="register-email"
                type="email" 
                placeholder="contoh@email.com" 
                error={errors.email?.message}
                {...register('email')} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input 
                id="register-password"
                type="password" 
                placeholder="••••••••" 
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
                  Saya setuju dengan <a href="#" className="text-yellow-500 hover:underline">Syarat & Ketentuan</a> serta Kebijakan Privasi.
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
        </Card>
      </div>
    </div>
  );
};

export default Register;
