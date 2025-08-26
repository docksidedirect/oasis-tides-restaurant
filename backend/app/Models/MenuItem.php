<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'is_available',
        'is_featured',
        'ingredients',
        'preparation_time',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
