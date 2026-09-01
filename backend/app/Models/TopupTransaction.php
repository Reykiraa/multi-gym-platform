<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopupTransaction extends Model
{
    use \Illuminate\Database\Eloquent\Concerns\HasUuids;

    protected $fillable = [
        'user_id',
        'topup_package_id',
        'order_id',
        'amount_idr',
        'total_credits',
        'snap_token',
        'status',
        'payment_type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function topupPackage()
    {
        return $this->belongsTo(TopupPackage::class);
    }
}
