// src/components/forms/TopUpForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { TopUpPayload } from '../../types/admin';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const topUpSchema = z.object({
  user_id: z.coerce.number().int().positive('User ID is required'),
  amount: z.coerce.number().int().positive('Credit amount must be greater than 0'),
});

type TopUpFormValues = z.infer<typeof topUpSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TopUpFormProps {
  onSubmit: (payload: TopUpPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * Modal form for manually topping up a user's credit balance.
 * Corresponds to POST /api/users/{id}/topup.
 */
const TopUpForm: React.FC<TopUpFormProps> = ({ onSubmit, onClose, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TopUpFormValues>({
    resolver: zodResolver(topUpSchema),
  });

  const handleFormSubmit = (values: TopUpFormValues) => {
    onSubmit({ user_id: values.user_id, amount: values.amount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Manual Top-Up</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 flex flex-col gap-4" noValidate>
          <Input
            id="topup-user-id"
            label="User ID"
            type="number"
            placeholder="10"
            error={errors.user_id?.message}
            {...register('user_id')}
          />
          <Input
            id="topup-amount"
            label="Credit Amount"
            type="number"
            placeholder="50"
            error={errors.amount?.message}
            {...register('amount')}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Process Top-Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpForm;
