import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import apiClient from '../../../lib/axios';

const securitySchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password confirmation does not match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

const Security: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema)
  });

  const onSubmit = async (data: SecurityFormValues) => {
    try {
      await apiClient.put('/user', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      window.alert("Password successfully changed!");
      reset();
    } catch (error: any) {
      if (error.response?.status === 422) {
        window.alert(error.response.data.message || "Validation failed");
      } else {
        window.alert("An error occurred while changing your password");
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
        <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Current Password</label>
            <Input type="password" placeholder="••••••••" {...register('currentPassword')} />
            {errors.currentPassword && <p className="text-rose-500 text-sm mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div className="border-t border-zinc-800 my-2"></div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">New Password</label>
            <Input type="password" placeholder="Minimum 6 characters" {...register('newPassword')} />
            {errors.newPassword && <p className="text-rose-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm New Password</label>
            <Input type="password" placeholder="Re-enter your new password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-rose-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 mt-4 text-lg">
            Update Password
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Security;
