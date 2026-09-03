import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import apiClient from '../../../lib/axios';

const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
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

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const response = await apiClient.put('/user', data);
      updateUser(response.data.user);
      window.alert("Profile updated!");
      navigate('/user/profile');
    } catch (error) {
      const axiosError = error as import('axios').AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 422) {
        window.alert(axiosError.response.data.message || "Validation failed");
      } else {
        window.alert("An error occurred while saving your profile");
      }
    }
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
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
            <Input type="text" placeholder="Enter your name" {...register('name')} />
            {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <Input type="email" placeholder="example@email.com" {...register('email')} />
            {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
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
