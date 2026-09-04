<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'credit_balance',
        'mitra_org_id',
        'is_oauth_user',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'member_since',
        'total_visits',
        'tier',
        'pending_credits',
        'available_credits',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_oauth_user' => 'boolean',
        ];
    }

    /**
     * Get the mitra organization this user (branch manager) belongs to.
     */
    public function mitraOrg(): BelongsTo
    {
        return $this->belongsTo(Mitra::class, 'mitra_org_id');
    }

    /**
     * Get the gyms associated with the user (as branch manager).
     */
    public function gyms(): HasMany
    {
        return $this->hasMany(Gym::class, 'mitra_id');
    }

    /**
     * Get the transactions for the user.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function getMemberSinceAttribute(): string
    {
        return $this->created_at ? $this->created_at->format('F Y') : '-';
    }

    public function getTotalVisitsAttribute(): int
    {
        return $this->transactions()
                    ->where('status', 'completed')
                    ->whereNotNull('gym_id')
                    ->count();
    }

    public function getTierAttribute(): ?string
    {
        if ($this->role !== 'user') {
            return null;
        }

        $visits = $this->total_visits;

        if ($visits > 50) return 'GOLD';
        if ($visits > 10) return 'SILVER';
        return 'MEMBER';
    }

    public function getPendingCreditsAttribute(): int
    {
        return (int) $this->transactions()
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->sum('amount');
    }

    public function getAvailableCreditsAttribute(): int
    {
        return max(0, $this->credit_balance - $this->pending_credits);
    }
}
