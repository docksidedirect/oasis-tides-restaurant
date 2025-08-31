<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@oasistides.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'phone' => '+1-555-0001',
            'address' => '123 Admin Street, Admin City',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Staff user
        \App\Models\User::create([
            'name' => 'Staff Member',
            'email' => 'staff@oasistides.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'phone' => '+1-555-0002',
            'address' => '456 Staff Avenue, Staff City',
            'role' => 'staff',
            'is_active' => true,
        ]);

        // Client user
        \App\Models\User::create([
            'name' => 'John Doe',
            'email' => 'client@oasistides.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'phone' => '+1-555-0003',
            'address' => '789 Client Road, Client City',
            'role' => 'client',
            'is_active' => true,
        ]);

        // Additional client users
        \App\Models\User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'phone' => '+1-555-0004',
            'address' => '321 Ocean View, Seaside',
            'role' => 'client',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Ahmed Al-Rashid',
            'email' => 'ahmed@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'phone' => '+1-555-0005',
            'address' => '654 Marina Boulevard, Coastal City',
            'role' => 'client',
            'is_active' => true,
        ]);
    }
}
