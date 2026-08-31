// src/hooks/api/useMitrasOrg.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminMitra, MitraFormPayload } from '../../types/admin';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';

const MITRA_ORG_KEY = ['admin', 'mitra-orgs'] as const;

/**
 * Fetch all mitra organizations for admin management and the GymForm dropdown.
 */
export const useMitraOrgs = () =>
  useQuery<AdminMitra[]>({
    queryKey: MITRA_ORG_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/mitras');
      return res.data;
    },
    staleTime: 60_000,
  });

/**
 * Create a new mitra organization.
 */
export const useCreateMitraOrg = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminMitra, Error, MitraFormPayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/mitras', payload);
      return res.data.mitra ?? res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MITRA_ORG_KEY });
      addToast('success', 'Mitra berhasil didaftarkan');
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Gagal mendaftarkan mitra');
    },
  });
};

/**
 * Update an existing mitra organization.
 */
export const useUpdateMitraOrg = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminMitra, Error, { id: number; payload: MitraFormPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.put(`/mitras/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MITRA_ORG_KEY });
      addToast('success', 'Mitra berhasil diperbarui');
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Gagal memperbarui mitra');
    },
  });
};

/**
 * Delete a mitra organization by ID.
 */
export const useDeleteMitraOrg = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/mitras/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MITRA_ORG_KEY });
      addToast('success', 'Mitra berhasil dihapus');
    },
    onError: (err: any) => {
      addToast('error', err.response?.data?.message || 'Gagal menghapus mitra');
    },
  });
};
