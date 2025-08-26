<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'reservation_date',
        'reservation_time',
        'party_size',
        'special_requests',
        'status',
    ];

    // Optionally, add casts if needed, e.g. for date/time
    protected $casts = [
        'reservation_date' => 'date',
        'reservation_time' => 'datetime:H:i',  // hour and minute
    ];

    // Reservation belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
