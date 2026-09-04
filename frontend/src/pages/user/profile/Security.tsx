import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import apiClient from '../../../lib/axios';
import { useAuthStore } from '../../../store/authStore';

const securitySchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

const Security: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isOauth = user?.is_oauth_user;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema)
  });

  const onSubmit = async (data: SecurityFormValues) => {
    if (!isOauth && (!data.currentPassword || data.currentPassword.length < 1)) {
      window.alert("Kata sandi saat ini wajib diisi");
      return;
    }
    
    try {
      const response = await apiClient.put('/user', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      window.alert(response.data.message || "Kata sandi berhasil diperbarui!");
      
      if (response.data.user) {
        useAuthStore.getState().updateUser(response.data.user);
      }
      
      reset();
    } catch (error: any) {
      if (error.response?.status === 422) {
        window.alert(error.response.data.message || "Validasi gagal");
      } else {
        window.alert("Terjadi kesalahan saat mengubah kata sandi");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950 p-4 sticky top-0 z-50 flex items-center">
        <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Security</h1>
      </header>

      <main className="flex-grow container mx-auto max-w-xl px-4 py-8">
        <h2 className="text-lg font-bold text-white mb-2">
          {isOauth ? "Buat Kata Sandi Akun" : "Ganti Kata Sandi"}
        </h2>
        {isOauth ? (
          <p className="text-zinc-400 text-sm mb-6">
            Akun Anda terhubung dengan Google Sign-In. Buat kata sandi baru jika Anda ingin memiliki opsi login menggunakan email & password manual.
          </p>
        ) : (
          <div className="mb-6"></div>
        )}
        
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {!isOauth && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Kata Sandi Saat Ini</label>
                <Input type="password" placeholder="••••••••" {...register('currentPassword')} />
                {errors.currentPassword && <p className="text-rose-500 text-sm mt-1">{errors.currentPassword.message}</p>}
              </div>
              <div className="border-t border-zinc-800 my-2"></div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Kata Sandi Baru</label>
            <Input type="password" placeholder="Minimal 8 karakter" {...register('newPassword')} />
            {errors.newPassword && <p className="text-rose-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Konfirmasi Kata Sandi</label>
            <Input type="password" placeholder="Masukkan ulang kata sandi" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-rose-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 mt-4 text-lg">
            {isOauth ? "Buat Kata Sandi" : "Simpan Perubahan"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Security;
