<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mitra extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'contact_email',
        'contact_phone',
        'address',
        'description',
    ];

    /**
     * Get the gym locations owned by this mitra organization.
     */
    public function gyms(): HasMany
    {
        return $this->hasMany(Gym::class, 'mitra_org_id');
    }

    /**
     * Get the branch manager user accounts that belong to this organization.
     */
    public function branchAccounts(): HasMany
    {
        return $this->hasMany(User::class, 'mitra_org_id');
    }
}
