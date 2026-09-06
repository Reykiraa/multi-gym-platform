<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gym extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'mitra_id',
        'mitra_org_id',
        'name',
        'location',
        'facilities',
        'photos',
        'credit_price',
        'maps_url',
    ];
    protected $appends = ['mitra_name', 'pengelola_name', 'image_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            // NOTE: 'photos' is intentionally NOT cast here.
            // The getPhotosAttribute accessor below handles JSON decoding
            // AND applies the Dynamic Image Resolver (localhost → live URL).
        ];
    }

    /**
     * Get the branch manager user that owns/operates this gym location.
     */
    public function mitra(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }

    /**
     * Get the parent mitra organization this gym belongs to.
     */
    public function mitraOrg(): BelongsTo
    {
        return $this->belongsTo(Mitra::class, 'mitra_org_id');
    }

    /**
     * Get the transactions associated with the gym.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Smart Accessor: Brand Organisasi B2B -> Fallback Nama Pengelola
     */
    public function getMitraNameAttribute(): string
    {
        // 1. Jika terhubung ke Organisasi Mitra B2B (tabel mitras via mitra_org_id)
        if ($this->mitra && $this->mitra->mitraOrg) {
            return $this->mitra->mitraOrg->name;
        }

        // 2. Jika Standalone, gunakan nama akun pengelola
        return $this->mitra?->name ?? 'Stand-Alone';
    }

    public function getPengelolaNameAttribute(): string
    {
        return $this->mitra?->name ?? '—';
    }

    /**
     * Dynamic Image Resolver: Accessor untuk kolom `photos`.
     *
     * Memastikan foto katalog tidak rusak / blank di perangkat mobile:
     * - URL yang masih berisi `localhost` atau `127.0.0.1` secara otomatis
     *   diarahkan ke live backend URL (APP_URL dari .env production).
     * - Array kosong / null akan dikembalikan sebagai 3 foto fallback Unsplash.
     *
     * @return array<int, string>
     */
    public function getPhotosAttribute(mixed $value): array
    {
        $photos = is_string($value)
            ? json_decode($value, true)
            : (array) $value;

        /** @var array<int, string> $fallback */
        $fallback = [
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
        ];

        if (empty($photos)) {
            return $fallback;
        }

        // Gunakan APP_URL (production) sebagai pengganti localhost
        $liveBackendUrl = rtrim((string) config('app.url', 'https://roamfit-api.onrender.com'), '/');

        return array_values(array_map(function (mixed $photo) use ($liveBackendUrl, $fallback): string {
            if (! is_string($photo) || $photo === '') {
                return $fallback[0];
            }

            // Ganti URL localhost/127.0.0.1 ke live backend URL
            if (str_contains($photo, 'localhost') || str_contains($photo, '127.0.0.1')) {
                return str_replace(
                    ['http://localhost:8000', 'https://localhost:8000', 'http://127.0.0.1:8000', 'https://127.0.0.1:8000'],
                    $liveBackendUrl,
                    $photo
                );
            }

            return $photo;
        }, $photos));
    }

    /**
     * Accessor `image_url`: URL foto pertama yang telah di-resolve.
     * Digunakan oleh GymCard di frontend untuk menampilkan thumbnail.
     */
    public function getImageUrlAttribute(): string
    {
        $photos = $this->photos;

        return $photos[0]
            ?? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
    }
}
