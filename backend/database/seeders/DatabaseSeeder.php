<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin
        User::updateOrCreate(
            ['email' => 'admin@gymnox.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password123', // Akan di-hash otomatis oleh model
                'role' => 'admin',
            ]
        );

        // 2. Akun Mitra (Resepsionis Gym)
        User::updateOrCreate(
            ['email' => 'mitra@gymnox.com'],
            [
                'name' => 'Resepsionis Elite Fitness',
                'password' => 'password123',
                'role' => 'mitra',
            ]
        );

        // 3. Akun User (Member Reguler)
        User::updateOrCreate(
            ['email' => 'user@gymnox.com'],
            [
                'name' => 'Member Budi',
                'password' => 'password123',
                'role' => 'user',
            ]
        );
    }
}
