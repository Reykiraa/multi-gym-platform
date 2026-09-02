// filepath: frontend/src/components/forms/GymForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus, Building2, ChevronDown } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { GymFormPayload, GymBranchPayload, AdminGym, AdminMitra } from '../../types/admin';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const newMitraSchema = z.object({
  mitra_name: z.string().min(3, 'Nama Mitra minimal 3 karakter'),
  mitra_email: z.string().email('Email tidak valid'),
  mitra_password: z.string().optional(),
  name: z.string().min(3, 'Nama gym minimal 3 karakter'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  facilities: z.string().min(1, 'Fasilitas wajib diisi (pisahkan dengan koma)'),
  credit_price: z
    .number({ error: 'Harga kredit wajib diisi' })
    .positive('Harga kredit harus lebih dari 0'),
});

const branchSchema = z.object({
  mitra_org_id: z.number({ error: 'Pilih organisasi mitra terlebih dahulu' }).positive('Pilih organisasi mitra'),
  branch_name: z.string().min(3, 'Nama Pengelola Cabang minimal 3 karakter'),
  branch_email: z.string().email('Email tidak valid'),
  branch_password: z.string().optional(),
  name: z.string().min(3, 'Nama gym minimal 3 karakter'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  facilities: z.string().min(1, 'Fasilitas wajib diisi (pisahkan dengan koma)'),
  credit_price: z
    .number({ error: 'Harga kredit wajib diisi' })
    .positive('Harga kredit harus lebih dari 0'),
});

type NewMitraValues = z.infer<typeof newMitraSchema>;
type BranchValues = z.infer<typeof branchSchema>;
type RegistrationMode = 'new' | 'branch';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GymFormProps {
  gym?: AdminGym | null;
  onSubmit: (payload: GymFormPayload) => void;
  onSubmitBranch?: (payload: GymBranchPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
  /** Pre-fetched mitra org list for the branch dropdown. */
  mitraOrgs?: AdminMitra[];
}

// ---------------------------------------------------------------------------
// Tab component
// ---------------------------------------------------------------------------

interface TabProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ active, icon, label, sublabel, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 border ${
      active
        ? 'bg-yellow-500/10 border-yellow-500/40'
        : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800'
    }`}
  >
    <div className={`flex items-center gap-2 font-semibold text-sm ${active ? 'text-yellow-400' : 'text-zinc-400'}`}>
      {icon}
      {label}
    </div>
    <span className="text-[11px] text-zinc-500 text-center leading-tight">{sublabel}</span>
  </button>
);

// ---------------------------------------------------------------------------
// Shared gym detail fields
// ---------------------------------------------------------------------------

interface GymDetailFieldsProps {
  idPrefix: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const GymDetailFields: React.FC<GymDetailFieldsProps> = ({ idPrefix, register, errors }) => (
  <>
    <Input
      id={`${idPrefix}-name`}
      label="Nama Gym"
      type="text"
      placeholder="FTL Sport Center - Sudirman"
      error={errors.name?.message as string | undefined}
      {...register('name')}
    />
    <Input
      id={`${idPrefix}-location`}
      label="Lokasi"
      type="text"
      placeholder="Jakarta Selatan"
      error={errors.location?.message as string | undefined}
      {...register('location')}
    />
    <Input
      id={`${idPrefix}-facilities`}
      label="Fasilitas (pisahkan dengan koma)"
      type="text"
      placeholder="Free Weights, Cardio, Sauna"
      error={errors.facilities?.message as string | undefined}
      {...register('facilities')}
    />
    <Input
      id={`${idPrefix}-credit`}
      label="Harga Kredit"
      type="number"
      placeholder="8"
      error={errors.credit_price?.message as string | undefined}
      {...register('credit_price', { valueAsNumber: true })}
    />
  </>
);

// ---------------------------------------------------------------------------
// Main GymForm
// ---------------------------------------------------------------------------

/**
 * Unified modal for gym registration with two modes:
 * - **Mitra Baru**: Creates a brand-new mitra account + gym (standalone operator).
 * - **Tambah Cabang**: Selects an existing mitra organization from dropdown, creates
 *   a new branch manager account, and registers the gym under that organization.
 */
const GymForm: React.FC<GymFormProps> = ({
  gym,
  onSubmit,
  onSubmitBranch,
  onClose,
  isLoading = false,
  mitraOrgs = [],
}) => {
  const isEdit = Boolean(gym);
  const [mode, setMode] = useState<RegistrationMode>('new');
  const [orgSearch, setOrgSearch] = useState('');
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<AdminMitra | null>(null);

  // Form: new mitra
  const newMitraForm = useForm<NewMitraValues>({
    resolver: zodResolver(newMitraSchema),
    defaultValues: {
      mitra_name: gym?.mitra_name || '',
      mitra_email: '',
      mitra_password: '',
      name: gym?.name || '',
      location: gym?.location || '',
      facilities: gym?.facilities ? gym.facilities.join(', ') : '',
      credit_price: gym?.credit_price || undefined,
    },
  });

  // Form: branch
  const branchForm = useForm<BranchValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      mitra_org_id: undefined,
      branch_name: '',
      branch_email: '',
      branch_password: '',
      name: '',
      location: '',
      facilities: '',
      credit_price: undefined,
    },
  });

  const filteredOrgs = mitraOrgs.filter(
    (o) =>
      o.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      (o.contact_email ?? '').toLowerCase().includes(orgSearch.toLowerCase()),
  );

  const selectOrg = (org: AdminMitra) => {
    setSelectedOrg(org);
    branchForm.setValue('mitra_org_id', org.id, { shouldValidate: true });
    setOrgSearch('');
    setOrgDropdownOpen(false);
  };

  const handleNewMitraSubmit: SubmitHandler<NewMitraValues> = (values) => {
    onSubmit({
      mitra_name: values.mitra_name,
      mitra_email: values.mitra_email,
      mitra_password: values.mitra_password || 'Gym1234!',
      name: values.name,
      location: values.location,
      facilities: values.facilities.split(',').map((f) => f.trim()).filter(Boolean),
      credit_price: values.credit_price,
    });
  };

  const handleBranchSubmit: SubmitHandler<BranchValues> = (values) => {
    if (!onSubmitBranch) return;
    onSubmitBranch({
      mitra_org_id: values.mitra_org_id,
      branch_name: values.branch_name,
      branch_email: values.branch_email,
      branch_password: values.branch_password || undefined,
      name: values.name,
      location: values.location,
      facilities: values.facilities.split(',').map((f) => f.trim()).filter(Boolean),
      credit_price: values.credit_price,
    });
  };

  const handleUnifiedSubmit = (e: React.FormEvent) => {
    if (isEdit) {
      e.preventDefault();

      const formValues = newMitraForm.getValues();
      const name = formValues.name;
      const location = formValues.location;
      const facilities = formValues.facilities;
      const creditPrice = formValues.credit_price;

      if (!name || !location || !creditPrice) {
        alert("Nama gym, lokasi, dan harga kredit wajib diisi.");
        return;
      }

      if (!gym) return;

      const payload = {
        name,
        location,
        facilities: Array.isArray(facilities)
          ? facilities
          : typeof facilities === 'string'
          ? (facilities as string).split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        credit_price: Number(creditPrice),
        mitra_id: gym.mitra_id,
        mitra_name: gym.mitra_name || '',
        mitra_email: '',
      };

      if (onSubmit) {
        onSubmit(payload as any);
      } else if (onSubmitBranch) {
        onSubmitBranch(payload as any);
      }
      return;
    }

    newMitraForm.handleSubmit(handleNewMitraSubmit)(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Gym' : 'Tambah Gym Baru'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {!isEdit && (
          <div className="flex gap-3 px-6 pt-4 shrink-0">
            <Tab
              active={mode === 'new'}
              icon={<UserPlus size={15} />}
              label="Gym Baru"
              sublabel="Gym baru & akun pengelola"
              onClick={() => setMode('new')}
            />
            <Tab
              active={mode === 'branch'}
              icon={<Building2 size={15} />}
              label="Tambah Cabang"
              sublabel="Cabang dari mitra yang sudah ada"
              onClick={() => setMode('branch')}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------
            MODE: Mitra Baru
        ---------------------------------------------------------------- */}
        {(isEdit || mode === 'new') && (
          <form
            id="form-new-mitra"
            onSubmit={handleUnifiedSubmit}
            className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
            noValidate
          >
            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white">Data Akun Pengelola</h3>
              <Input
                id="mitra-name"
                label="Nama Pengelola"
                type="text"
                placeholder="John Doe"
                error={newMitraForm.formState.errors.mitra_name?.message}
                {...newMitraForm.register('mitra_name')}
                disabled={isEdit}
              />
              {!isEdit && (
                <>
                  <Input
                    id="mitra-email"
                    label="Email Login"
                    type="email"
                    placeholder="pengelola@gym.com"
                    error={newMitraForm.formState.errors.mitra_email?.message}
                    {...newMitraForm.register('mitra_email')}
                  />
                  <Input
                    id="mitra-password"
                    label="Password (Opsional)"
                    type="password"
                    placeholder="Gym1234!"
                    error={newMitraForm.formState.errors.mitra_password?.message}
                    {...newMitraForm.register('mitra_password')}
                  />
                  <p className="text-xs text-zinc-500">
                    * Jika kosong, password default:{' '}
                    <code className="text-yellow-500">Gym1234!</code>
                  </p>
                </>
              )}
            </div>

            <GymDetailFields
              idPrefix="new"
              register={newMitraForm.register}
              errors={newMitraForm.formState.errors}
            />

            <div className="flex items-center justify-end gap-3 pt-2 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isEdit ? 'Simpan Perubahan' : 'Buat Gym Baru'}
              </Button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------------
            MODE: Tambah Cabang — select org from dropdown + new branch account
        ---------------------------------------------------------------- */}
        {!isEdit && mode === 'branch' && (
          <form
            id="form-branch"
            onSubmit={branchForm.handleSubmit(handleBranchSubmit)}
            className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
            noValidate
          >
            {/* Step 1: Select Mitra Org */}
            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] flex items-center justify-center font-bold shrink-0">1</span>
                Pilih Organisasi Mitra
              </h3>

              {/* Selected org pill */}
              {selectedOrg ? (
                <div className="flex items-center justify-between bg-zinc-700/60 border border-zinc-600 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedOrg.name}</p>
                      {selectedOrg.contact_email && (
                        <p className="text-xs text-zinc-400">{selectedOrg.contact_email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrg(null);
                      branchForm.setValue('mitra_org_id', undefined as unknown as number);
                    }}
                    className="text-zinc-400 hover:text-white ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOrgDropdownOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm hover:border-zinc-500 transition-colors"
                  >
                    <span className="text-zinc-500">
                      {mitraOrgs.length === 0
                        ? 'Belum ada mitra — daftarkan di halaman Mitra'
                        : 'Cari & pilih organisasi mitra...'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 transition-transform ${orgDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {orgDropdownOpen && mitraOrgs.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-2 border-b border-zinc-700">
                        <input
                          type="text"
                          value={orgSearch}
                          onChange={(e) => setOrgSearch(e.target.value)}
                          placeholder="Cari nama atau email..."
                          className="w-full bg-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {filteredOrgs.length === 0 ? (
                          <p className="text-center text-zinc-500 text-sm py-4">Tidak ditemukan</p>
                        ) : (
                          filteredOrgs.map((org) => (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => selectOrg(org)}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-700 transition-colors text-left"
                            >
                              <div>
                                <span className="text-sm font-medium text-white block">{org.name}</span>
                                {org.contact_email && (
                                  <span className="text-xs text-zinc-400">{org.contact_email}</span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-500 shrink-0 ml-3">
                                {org.gyms_count} cabang
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {branchForm.formState.errors.mitra_org_id && (
                <p className="text-xs text-rose-500">{branchForm.formState.errors.mitra_org_id.message}</p>
              )}
            </div>

            {/* Step 2: Branch manager account */}
            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] flex items-center justify-center font-bold shrink-0">2</span>
                Akun Pengelola Cabang
              </h3>
              <Input
                id="branch-name"
                label="Nama Pengelola Cabang"
                type="text"
                placeholder="Andi Prasetyo"
                error={branchForm.formState.errors.branch_name?.message}
                {...branchForm.register('branch_name')}
              />
              <Input
                id="branch-email"
                label="Email Login"
                type="email"
                placeholder="cabang.sudirman@ftl.com"
                error={branchForm.formState.errors.branch_email?.message}
                {...branchForm.register('branch_email')}
              />
              <Input
                id="branch-password"
                label="Password (Opsional)"
                type="password"
                placeholder="Gym1234!"
                error={branchForm.formState.errors.branch_password?.message}
                {...branchForm.register('branch_password')}
              />
              <p className="text-xs text-zinc-500">
                * Jika kosong, password default:{' '}
                <code className="text-yellow-500">Gym1234!</code>
              </p>
            </div>

            {/* Step 3: Gym detail */}
            <GymDetailFields
              idPrefix="branch"
              register={branchForm.register}
              errors={branchForm.formState.errors}
            />

            <div className="flex items-center justify-end gap-3 pt-2 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Tambah Cabang Gym
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GymForm;