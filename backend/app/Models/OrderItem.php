<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'unit_price',
        'total_price',
        'customizations',
        'special_instructions',
    ];

    protected $casts = [
        'customizations' => 'array',
    ];

    // Relationship to the parent order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship to the menu item ordered
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
