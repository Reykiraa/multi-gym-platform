import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  phone: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = (data: EditProfileFormValues) => {
    updateUser(data);
    window.alert("Profile updated!");
    navigate('/user/profile');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950 p-4 sticky top-0 z-50 flex items-center">
        <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Edit Profile</h1>
      </header>

      <main className="flex-grow container mx-auto max-w-xl px-4 py-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nama Lengkap</label>
            <Input type="text" placeholder="Masukkan nama" {...register('name')} />
            {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <Input type="email" placeholder="contoh@email.com" {...register('email')} />
            {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">No Handphone</label>
            <Input type="tel" placeholder="081234567890" {...register('phone')} />
            {errors.phone && <p className="text-rose-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 mt-4 text-lg">
            Save Changes
          </Button>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
