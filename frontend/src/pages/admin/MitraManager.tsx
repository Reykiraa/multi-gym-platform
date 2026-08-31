// src/pages/admin/MitraManager.tsx
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Building2, Dumbbell, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  useMitraOrgs,
  useCreateMitraOrg,
  useUpdateMitraOrg,
  useDeleteMitraOrg,
} from '../../hooks/api/useMitrasOrg';
import type { AdminMitra, MitraFormPayload } from '../../types/admin';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const mitraSchema = z.object({
  name: z.string().min(3, 'Nama mitra minimal 3 karakter'),
  contact_email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

type MitraFormValues = z.infer<typeof mitraSchema>;

// ---------------------------------------------------------------------------
// Inline form modal
// ---------------------------------------------------------------------------

interface MitraFormModalProps {
  mitra?: AdminMitra | null;
  onSubmit: (payload: MitraFormPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const MitraFormModal: React.FC<MitraFormModalProps> = ({ mitra, onSubmit, onClose, isLoading = false }) => {
  const isEdit = Boolean(mitra);

  const { register, handleSubmit, formState: { errors } } = useForm<MitraFormValues>({
    resolver: zodResolver(mitraSchema),
    defaultValues: {
      name: mitra?.name ?? '',
      contact_email: mitra?.contact_email ?? '',
      contact_phone: mitra?.contact_phone ?? '',
      address: mitra?.address ?? '',
      description: mitra?.description ?? '',
    },
  });

  const handleFormSubmit: SubmitHandler<MitraFormValues> = (values) => {
    onSubmit({
      name: values.name,
      contact_email: values.contact_email || undefined,
      contact_phone: values.contact_phone || undefined,
      address: values.address || undefined,
      description: values.description || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-white">
              {isEdit ? 'Edit Mitra' : 'Daftarkan Mitra Baru'}
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 flex flex-col gap-4" noValidate>
          <Input
            id="mitra-org-name"
            label="Nama Organisasi / Brand"
            type="text"
            placeholder="PT FTL Sport Indonesia"
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="mitra-contact-email"
              label="Email Kontak (Opsional)"
              type="email"
              placeholder="info@ftl.com"
              error={errors.contact_email?.message}
              {...register('contact_email')}
            />
            <Input
              id="mitra-contact-phone"
              label="Telepon (Opsional)"
              type="text"
              placeholder="+62 21 xxxx xxxx"
              error={errors.contact_phone?.message}
              {...register('contact_phone')}
            />
          </div>
          <Input
            id="mitra-address"
            label="Alamat Kantor (Opsional)"
            type="text"
            placeholder="Jl. Sudirman No. 1, Jakarta"
            error={errors.address?.message}
            {...register('address')}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Deskripsi (Opsional)</label>
            <textarea
              id="mitra-description"
              rows={3}
              placeholder="Jaringan gym premium dengan 20+ cabang di seluruh Indonesia"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-500 outline-none focus:border-yellow-500/60 transition-colors resize-none"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {isEdit ? 'Simpan Perubahan' : 'Daftarkan Mitra'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main MitraManager page
// ---------------------------------------------------------------------------

/**
 * Admin Mitra Organization Manager page.
 * Allows admin to register, edit, and delete mitra organizations (brands/companies).
 * Mitra organizations are the parent entities for gym branches.
 */
const MitraManager: React.FC = () => {
  const { data: mitras = [], isLoading } = useMitraOrgs();
  const createMitra = useCreateMitraOrg();
  const updateMitra = useUpdateMitraOrg();
  const deleteMitra = useDeleteMitraOrg();

  const [showForm, setShowForm] = useState(false);
  const [editingMitra, setEditingMitra] = useState<AdminMitra | null>(null);

  const handleCreate = (payload: MitraFormPayload) => {
    createMitra.mutate(payload, { onSuccess: () => setShowForm(false) });
  };

  const handleUpdate = (payload: MitraFormPayload) => {
    if (!editingMitra) return;
    updateMitra.mutate({ id: editingMitra.id, payload }, { onSuccess: () => setEditingMitra(null) });
  };

  const handleDelete = (mitra: AdminMitra) => {
    if (!confirm(`Hapus mitra "${mitra.name}"? Cabang dan akun terkait akan dilepas dari organisasi ini.`)) return;
    deleteMitra.mutate(mitra.id);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mitra Organisasi</h1>
          <p className="text-zinc-400 mt-1">Kelola brand & perusahaan gym partner platform</p>
        </div>
        <Button
          id="btn-add-mitra-org"
          variant="primary"
          onClick={() => { setShowForm(true); setEditingMitra(null); }}
        >
          <Plus size={18} className="mr-2" />
          Daftarkan Mitra
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{mitras.length}</p>
            <p className="text-xs text-zinc-400">Total Organisasi</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Dumbbell size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {mitras.reduce((s, m) => s + m.gyms_count, 0)}
            </p>
            <p className="text-xs text-zinc-400">Total Cabang Gym</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 font-medium">Nama Organisasi</th>
                <th className="px-6 py-4 font-medium">Email Kontak</th>
                <th className="px-6 py-4 font-medium text-center">Cabang</th>
                <th className="px-6 py-4 font-medium text-center">Akun Pengelola</th>
                <th className="px-6 py-4 font-medium">Terdaftar</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Memuat data mitra...
                  </td>
                </tr>
              ) : mitras.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-500">
                      <Building2 size={40} className="opacity-30" />
                      <p>Belum ada mitra terdaftar.</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-yellow-500 text-sm hover:underline"
                      >
                        Daftarkan mitra pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                mitras.map((mitra) => (
                  <tr key={mitra.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                          <Building2 size={15} className="text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{mitra.name}</p>
                          {mitra.address && (
                            <p className="text-xs text-zinc-500 truncate max-w-[180px]">{mitra.address}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {mitra.contact_email ?? <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                        <Dumbbell size={11} />
                        {mitra.gyms_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                        <Users size={11} />
                        {mitra.branch_accounts_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm whitespace-nowrap">
                      {formatDate(mitra.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditingMitra(mitra); setShowForm(false); }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-yellow-500 hover:bg-zinc-800 transition-colors"
                          aria-label={`Edit ${mitra.name}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(mitra)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-800 transition-colors"
                          aria-label={`Hapus ${mitra.name}`}
                        >
                          <Trash2 size={15} />
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

      {/* Modals */}
      {showForm && (
        <MitraFormModal
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={createMitra.isPending}
        />
      )}
      {editingMitra && (
        <MitraFormModal
          mitra={editingMitra}
          onSubmit={handleUpdate}
          onClose={() => setEditingMitra(null)}
          isLoading={updateMitra.isPending}
        />
      )}
    </div>
  );
};

export default MitraManager;
