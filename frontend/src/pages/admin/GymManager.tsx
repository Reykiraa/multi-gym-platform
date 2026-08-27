// src/pages/admin/GymManager.tsx
import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import GymForm from '../../components/forms/GymForm';
import { useGyms, useCreateGym, useUpdateGym, useDeleteGym } from '../../hooks/api/useGyms';
import type { AdminGym, GymFormPayload } from '../../types/admin';

/**
 * Admin Gym Management page — full CRUD table for gym partners.
 */
const GymManager: React.FC = () => {
  const { data: gyms = [], isLoading } = useGyms();
  const createGym = useCreateGym();
  const updateGym = useUpdateGym();
  const deleteGym = useDeleteGym();

  const [showForm, setShowForm] = useState(false);
  const [editingGym, setEditingGym] = useState<AdminGym | null>(null);

  const handleCreate = (payload: GymFormPayload) => {
    createGym.mutate(payload, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (payload: GymFormPayload) => {
    if (!editingGym) return;
    updateGym.mutate(
      { id: editingGym.id, payload },
      { onSuccess: () => setEditingGym(null) },
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('Yakin ingin menghapus gym ini?')) return;
    deleteGym.mutate(id);
  };

  const openEdit = (gym: AdminGym) => {
    setEditingGym(gym);
    setShowForm(false);
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gym Network</h1>
          <p className="text-zinc-400 mt-1">Kelola data gym partner platform</p>
        </div>
        <Button
          id="btn-add-gym"
          variant="primary"
          onClick={() => { setShowForm(true); setEditingGym(null); }}
        >
          <Plus size={18} className="mr-2" />
          Tambah Gym
        </Button>
      </div>

      {/* Table — wrapped in overflow-x-auto for mobile scroll */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 font-medium">Nama Gym</th>
                <th className="px-6 py-4 font-medium">Lokasi</th>
                <th className="px-6 py-4 font-medium">Mitra</th>
                <th className="px-6 py-4 font-medium">Fasilitas</th>
                <th className="px-6 py-4 font-medium text-right">Kredit</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Memuat data gym...
                  </td>
                </tr>
              ) : gyms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Belum ada data gym.
                  </td>
                </tr>
              ) : (
                gyms.map((gym) => (
                  <tr key={gym.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      {gym.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                      {gym.location}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                      {gym.mitra_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {gym.facilities.map((f) => (
                          <Badge key={f}>{f}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-yellow-500 font-semibold whitespace-nowrap">
                      {gym.credit_price} Kredit
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(gym)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-yellow-500 hover:bg-zinc-800 transition-colors"
                          aria-label={`Edit ${gym.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(gym.id)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-800 transition-colors"
                          aria-label={`Hapus ${gym.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showForm && (
        <GymForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={createGym.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingGym && (
        <GymForm
          gym={editingGym}
          onSubmit={handleUpdate}
          onClose={() => setEditingGym(null)}
          isLoading={updateGym.isPending}
        />
      )}
    </div>
  );
};

export default GymManager;
