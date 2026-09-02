import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, X, Upload, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToastStore } from '../../store/toastStore';

const gymProfileSchema = z.object({
  name: z.string().min(3, 'Nama gym minimal 3 karakter'),
  location: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  facilities: z.array(z.string()).min(1, 'Pilih minimal satu fasilitas'),
  photos: z.array(z.any()).optional(),
  maps_url: z.string().optional(),
});

type GymProfileFormValues = z.infer<typeof gymProfileSchema>;

const fetchMyGym = async () => {
  const response = await apiClient.get('/mitra/my-gym');
  return response.data?.data || response.data;
};

const updateMyGym = async (data: any) => {
  const response = await apiClient.put(`/mitra/my-gym`, data);
  return response.data;
};

const MitraGymProfile: React.FC = () => {
  const [facilityInput, setFacilityInput] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const { data: gymData, isLoading: isFetching } = useQuery({
    queryKey: ['my-gym'],
    queryFn: fetchMyGym,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<GymProfileFormValues>({
    resolver: zodResolver(gymProfileSchema),
    defaultValues: {
      name: '',
      location: '',
      facilities: [],
      photos: [],
      maps_url: '',
    }
  });

  useEffect(() => {
    if (gymData) {
      reset({
        name: gymData.name || '',
        location: gymData.location || '',
        facilities: gymData.facilities || [],
        photos: gymData.photos || [], 
        maps_url: gymData.maps_url || '',
      });
      if (gymData.photos && gymData.photos.length > 0) {
        setPreviewUrls(gymData.photos);
      }
    }
  }, [gymData, reset]);

  const facilities = watch('facilities') || [];

  const processFacilityInput = (input: string) => {
    const newFacilities = input
      .split(/[,;\n]+/)
      .map(f => f.trim())
      .filter(f => f !== '');
      
    if (newFacilities.length > 0) {
      const uniqueNew = newFacilities.filter(f => !facilities.includes(f));
      if (uniqueNew.length > 0) {
        setValue('facilities', [...facilities, ...uniqueNew], { shouldValidate: true });
      }
    }
  };

  const handleAddFacility = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processFacilityInput(facilityInput);
      setFacilityInput('');
    }
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) {
       processFacilityInput(val);
       setFacilityInput('');
    } else {
       setFacilityInput(val);
    }
  };

  const handleFacilityBlur = () => {
    if (facilityInput.trim()) {
      processFacilityInput(facilityInput);
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setValue('facilities', facilities.filter(f => f !== facility), { shouldValidate: true });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
      
      const currentPhotos = watch('photos') || [];
      setValue('photos', [...currentPhotos, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    const currentPhotos = watch('photos') || [];
    const newPhotos = [...currentPhotos];
    newPhotos.splice(index, 1);
    setValue('photos', newPhotos);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => updateMyGym(data),
    onSuccess: () => {
      addToast('success', 'Profil Gym berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['my-gym'] });
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal menyimpan profil gym');
    }
  });

  const onSubmit = async (data: GymProfileFormValues) => {
    if (!gymData?.id) {
       addToast('error', 'Data Gym tidak ditemukan');
       return;
    }
    
    // Convert new File objects to base64
    const processedPhotos = await Promise.all(
      (data.photos || []).map(async (photo: any) => {
        if (photo instanceof File) {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(photo);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        }
        return photo;
      })
    );

    let finalMapsUrl = data.maps_url || '';
    if (finalMapsUrl.includes('<iframe') && finalMapsUrl.includes('src="')) {
      const match = finalMapsUrl.match(/src="([^"]+)"/);
      if (match && match[1]) {
        finalMapsUrl = match[1];
      }
    }

    const payload = {
      name: data.name,
      location: data.location,
      facilities: data.facilities,
      photos: processedPhotos,
      maps_url: finalMapsUrl,
    };
    mutation.mutate(payload);
  };

  if (isFetching) {
    return <div className="text-zinc-500 text-center py-20">Memuat data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pengaturan Profil Gym</h1>
        <p className="text-zinc-400">Kelola informasi fasilitas dan foto gym Anda di platform.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Informasi Dasar</h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nama Gym</label>
            <Input 
              type="text" 
              placeholder="Masukkan nama gym" 
              {...register('name')} 
            />
            {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Lokasi Lengkap</label>
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all resize-none h-24"
              placeholder="Alamat lengkap gym"
              {...register('location')}
            />
            {errors.location && <p className="text-rose-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Google Maps Embed Link (Opsional)</span>
            </label>
            <Input 
              type="text" 
              placeholder="Paste URL atau seluruh kode <iframe...> dari Google Maps" 
              {...register('maps_url')} 
            />
            {errors.maps_url && <p className="text-rose-500 text-sm mt-1">{errors.maps_url.message}</p>}

            <div className="mt-4 bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Info className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Cara mendapatkan link Embed Peta:</h4>
                  <ol className="list-decimal pl-4 space-y-1.5 text-sm text-zinc-400">
                    <li>Cari gym Anda di <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-yellow-500 hover:underline">Google Maps</a>.</li>
                    <li>Klik tombol <strong>Share</strong> (Bagikan).</li>
                    <li>Pilih tab <strong>Embed a map</strong> (Sematkan peta).</li>
                    <li>Klik <strong>COPY HTML</strong> dan langsung <i>paste</i> ke kolom di atas. Sistem kami akan mengambil link-nya secara otomatis.</li>
                  </ol>
                </div>
              </div>
              <img 
                src="https://placehold.co/800x250/18181b/eab308?text=1.+Klik+Share+%0A+2.+Pilih+Embed+a+map+%0A+3.+Copy+HTML" 
                alt="Tutorial Embed Google Maps" 
                className="w-full rounded-lg border border-zinc-800 shadow-md opacity-80"
              />
            </div>
          </div>
        </Card>

        {/* Facilities */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Fasilitas</h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tambah Fasilitas</label>
            <Input 
              type="text" 
              placeholder="Ketik fasilitas (pisahkan dengan koma atau tekan Enter)" 
              value={facilityInput}
              onChange={handleFacilityChange}
              onKeyDown={handleAddFacility}
              onBlur={handleFacilityBlur}
            />
            {errors.facilities && <p className="text-rose-500 text-sm mt-1">{errors.facilities.message}</p>}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {facilities.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-medium">
                {fac}
                <button 
                  type="button" 
                  onClick={() => handleRemoveFacility(fac)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {facilities.length === 0 && (
              <span className="text-zinc-500 text-sm">Belum ada fasilitas yang ditambahkan.</span>
            )}
          </div>
        </Card>

        {/* Gallery */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Galeri Foto</h2>
          
          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-950/50 hover:bg-zinc-800/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
            <div className="bg-zinc-800 p-4 rounded-full text-zinc-400 mb-4">
              <Camera size={32} />
            </div>
            <p className="text-white font-medium mb-1">Klik atau seret foto ke sini</p>
            <p className="text-zinc-500 text-sm">PNG, JPG, WEBP (Max 5MB)</p>
          </div>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-zinc-700">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removePhoto(idx)}
                      className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={mutation.isPending}
            className="px-8 py-3 font-bold"
          >
            {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MitraGymProfile;
