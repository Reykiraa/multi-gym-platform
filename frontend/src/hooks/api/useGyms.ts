// src/hooks/api/useGyms.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminGym, GymFormPayload } from '../../types/admin';

/** Query key namespace for Gym data. */
const GYM_QUERY_KEY = ['admin', 'gyms'] as const;

/** Simulates network latency for realistic UX testing. */
const mockDelay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock dataset — mirrors the JSON shape from GET /api/gyms.
 * Mutable so that create/update/delete mutations visually reflect in the UI.
 */
let mockGyms: AdminGym[] = [
  {
    id: 1,
    mitra_id: 2,
    mitra_name: 'Budi Mitra',
    name: 'Iron Works Elite',
    location: 'Jakarta Selatan',
    facilities: ['Free Weights', 'Cardio', 'Sauna'],
    credit_price: 8,
    created_at: '2026-07-15T10:30:00Z',
  },
  {
    id: 2,
    mitra_id: 3,
    mitra_name: 'Andi Fitness',
    name: 'The Foundry',
    location: 'Bandung',
    facilities: ['Crossfit', 'Locker Room', 'Cafe'],
    credit_price: 6,
    created_at: '2026-07-20T14:00:00Z',
  },
  {
    id: 3,
    mitra_id: 4,
    mitra_name: 'Citra Yoga',
    name: 'Apex Studio',
    location: 'Surabaya',
    facilities: ['Yoga', 'Pilates', 'Shower'],
    credit_price: 4,
    created_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 4,
    mitra_id: 5,
    mitra_name: 'Dodi Sport',
    name: 'Flex Space',
    location: 'Bali',
    facilities: ['Crossfit', 'Pool', 'Cafe'],
    credit_price: 10,
    created_at: '2026-08-10T11:00:00Z',
  },
];

/**
 * Fetches the full gym list for Admin.
 * Replace the mock with `axios.get('/api/gyms')` when backend is ready.
 */
export const useGyms = () =>
  useQuery<AdminGym[]>({
    queryKey: GYM_QUERY_KEY,
    queryFn: async () => {
      await mockDelay();
      return [...mockGyms];
    },
  });

/**
 * Creates a new Gym. On success, invalidates the gym list so TanStack Query refetches.
 */
export const useCreateGym = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminGym, Error, GymFormPayload>({
    mutationFn: async (payload) => {
      await mockDelay(800);
      const newGym: AdminGym = {
        ...payload,
        id: Date.now(),
        mitra_name: `Mitra #${payload.mitra_id}`,
        created_at: new Date().toISOString(),
      };
      mockGyms = [...mockGyms, newGym];
      return newGym;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
    },
  });
};

/**
 * Updates an existing Gym by ID.
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminGym, Error, { id: number; payload: GymFormPayload }>({
    mutationFn: async ({ id, payload }) => {
      await mockDelay(800);
      const index = mockGyms.findIndex((g) => g.id === id);
      if (index === -1) throw new Error('Gym tidak ditemukan');
      const updated: AdminGym = {
        ...mockGyms[index],
        ...payload,
        mitra_name: `Mitra #${payload.mitra_id}`,
      };
      mockGyms = mockGyms.map((g) => (g.id === id ? updated : g));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
    },
  });
};

/**
 * Deletes a Gym by ID.
 */
export const useDeleteGym = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await mockDelay(600);
      mockGyms = mockGyms.filter((g) => g.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GYM_QUERY_KEY });
    },
  });
};
