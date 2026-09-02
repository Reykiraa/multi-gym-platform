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
}
