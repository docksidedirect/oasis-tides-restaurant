<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image',
        'popular',
        'available',
        'ingredients',
        'allergens',
    ];

    protected $casts = [
        'popular' => 'boolean',
        'available' => 'boolean',
        'ingredients' => 'array',
        'allergens' => 'array',
    ];
}
