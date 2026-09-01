<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopupPackage extends Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUuids;

    protected $fillable = [
        'name',
        'price_idr',
        'credits',
        'bonus_credits',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
