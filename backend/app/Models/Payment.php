<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_gateway',
        'transaction_id',
        'amount',
        'status', // pending, completed, failed, refunded, etc.
        'payment_method',
        'paid_at',
        'details', // JSON for response or metadata
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'details' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
