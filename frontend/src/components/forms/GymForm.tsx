// src/components/forms/GymForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { GymFormPayload, AdminGym } from '../../types/admin';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const gymSchema = z.object({
  mitra_id: z.coerce.number().int().positive('Mitra ID wajib diisi'),
  name: z.string().min(3, 'Nama gym minimal 3 karakter'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  facilities: z.string().min(1, 'Fasilitas wajib diisi (pisahkan dengan koma)'),
  credit_price: z.coerce.number().positive('Harga kredit harus lebih dari 0'),
});

type GymFormValues = z.infer<typeof gymSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GymFormProps {
  /** If provided, the form is in "edit" mode and pre-fills with this gym's data. */
  gym?: AdminGym | null;
  /** Called with the validated payload when the form is submitted. */
  onSubmit: (payload: GymFormPayload) => void;
  /** Closes the modal/dialog. */
  onClose: () => void;
  /** Disables the submit button and shows a spinner. */
  isLoading?: boolean;
}

/**
 * Reusable modal form for creating or editing a Gym.
 * Facilities are entered as a comma-separated string, then split into an array
 * before submission to match the API contract.
 */
const GymForm: React.FC<GymFormProps> = ({ gym, onSubmit, onClose, isLoading = false }) => {
  const isEdit = Boolean(gym);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
    defaultValues: {
      mitra_id: gym?.mitra_id ?? ('' as unknown as number),
      name: gym?.name ?? '',
      location: gym?.location ?? '',
      facilities: gym?.facilities.join(', ') ?? '',
      credit_price: gym?.credit_price ?? ('' as unknown as number),
    },
  });

  // Reset form values when the gym prop changes (switching between edit targets).
  useEffect(() => {
    if (gym) {
      reset({
        mitra_id: gym.mitra_id,
        name: gym.name,
        location: gym.location,
        facilities: gym.facilities.join(', '),
        credit_price: gym.credit_price,
      });
    }
  }, [gym, reset]);

  const handleFormSubmit = (values: GymFormValues) => {
    const payload: GymFormPayload = {
      mitra_id: values.mitra_id,
      name: values.name,
      location: values.location,
      facilities: values.facilities.split(',').map((f) => f.trim()).filter(Boolean),
      credit_price: values.credit_price,
    };
    onSubmit(payload);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Gym' : 'Tambah Gym Baru'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors" aria-label="Tutup modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 flex flex-col gap-4" noValidate>
          <Input
            id="gym-mitra-id"
            label="Mitra ID"
            type="number"
            placeholder="2"
            error={errors.mitra_id?.message}
            {...register('mitra_id')}
          />
          <Input
            id="gym-name"
            label="Nama Gym"
            type="text"
            placeholder="Iron Works Elite"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            id="gym-location"
            label="Lokasi"
            type="text"
            placeholder="Jakarta Selatan"
            error={errors.location?.message}
            {...register('location')}
          />
          <Input
            id="gym-facilities"
            label="Fasilitas (pisahkan dengan koma)"
            type="text"
            placeholder="Free Weights, Cardio, Sauna"
            error={errors.facilities?.message}
            {...register('facilities')}
          />
          <Input
            id="gym-credit-price"
            label="Harga Kredit"
            type="number"
            placeholder="8"
            error={errors.credit_price?.message}
            {...register('credit_price')}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {isEdit ? 'Simpan Perubahan' : 'Tambah Gym'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GymForm;
