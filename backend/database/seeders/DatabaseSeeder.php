<?php

namespace Database\Seeders;

use App\Models\Gym;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::firstOrCreate(
            ['email' => 'admin@multigym.com'],
            [
                'name' => 'Admin Gymnox',
                'password' => 'password',
                'role' => 'admin',
                'credit_balance' => 0,
            ]
        );

        // Mitras
        $mitra1 = User::firstOrCreate(
            ['email' => 'mitra1@gym.com'],
            [
                'name' => 'Mitra Satu',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra2 = User::firstOrCreate(
            ['email' => 'mitra2@gym.com'],
            [
                'name' => 'Mitra Dua',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        // Users
        User::firstOrCreate(
            ['email' => 'user1@member.com'],
            [
                'name' => 'Member Satu',
                'password' => 'password',
                'role' => 'user',
                'credit_balance' => 50,
            ]
        );

        User::firstOrCreate(
            ['email' => 'user2@member.com'],
            [
                'name' => 'Member Dua',
                'password' => 'password',
                'role' => 'user',
                'credit_balance' => 20,
            ]
        );

        // Gyms
        Gym::firstOrCreate(
            ['name' => 'Gym Alpha Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Jakarta',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'credit_price' => 10,
            ]
        );

        Gym::firstOrCreate(
            ['name' => 'Gym Beta Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'credit_price' => 5,
            ]
        );

        Gym::firstOrCreate(
            ['name' => 'Gym Charlie Mitra 2'],
            [
                'mitra_id' => $mitra2->id,
                'location' => 'Surabaya',
                'facilities' => ['Yoga', 'Crossfit'],
                'credit_price' => 8,
            ]
        );
    }
}
