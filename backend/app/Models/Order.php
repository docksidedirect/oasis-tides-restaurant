<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal',
        'tax_amount',
        'delivery_fee',
        'total_amount',
        'status',
        'order_type',
        'delivery_address',
        'payment_method',
        'payment_status',
        'notes',
        'estimated_delivery_time',
    ];

    protected $casts = [
        'estimated_delivery_time' => 'datetime',
    ];

    // User who placed the order
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Items in this order
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
