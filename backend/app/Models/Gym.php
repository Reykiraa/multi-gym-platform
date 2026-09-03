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
    protected $appends = ['mitra_name', 'pengelola_name'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'photos' => 'array',
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
}
