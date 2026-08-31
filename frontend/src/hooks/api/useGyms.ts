// src/hooks/api/useGyms.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminGym, GymFormPayload, GymBranchPayload, MitraOption } from '../../types/admin';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';

/** Query key namespace for Gym data. */
const GYM_QUERY_KEY = ['admin', 'gyms'] as const;
const MITRA_QUERY_KEY = ['admin', 'mitras'] as const;

/**
 * Fetches the full gym list for Admin.
 */
export const useGyms = () =>
  useQuery<AdminGym[]>({
    queryKey: GYM_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/gyms');
      return response.data;
    },
  });

/**
 * Fetches all mitra accounts for the "Tambah Cabang" dropdown.
 * Only used in the admin Gym Manager form.
 */
export const useMitras = () =>
  useQuery<MitraOption[]>({
    queryKey: MITRA_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/users/mitras');
      return response.data;
    },
    staleTime: 60_000, // Mitra list changes infrequently; 1-minute cache is sufficient
  });

/**
 * Creates a new Gym. On success, invalidates the gym list so TanStack Query refetches.
 */
export const useCreateGym = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminGym, Error, GymFormPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/gyms', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
      addToast('success', 'Gym berhasil ditambahkan');
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal menambahkan gym');
    }
  });
};

/**
 * Creates a new gym branch under an existing mitra account.
 * Posts to POST /api/gyms/branch — no user creation occurs.
 */
export const useCreateGymBranch = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminGym, Error, GymBranchPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/gyms/branch', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
      addToast('success', 'Cabang gym berhasil ditambahkan');
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal menambahkan cabang gym');
    }
  });
};

/**
 * Updates an existing Gym by ID.
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminGym, Error, { id: number; payload: GymFormPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put(`/gyms/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
      addToast('success', 'Gym berhasil diperbarui');
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal memperbarui gym');
    }
  });
};

/**
 * Deletes a Gym by ID.
 */
export const useDeleteGym = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/gyms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
      addToast('success', 'Gym berhasil dihapus');
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal menghapus gym');
    }
  });
};
