<?php

namespace Database\Seeders;

use App\Models\Gym;
use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\TopupPackageSeeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        ini_set('memory_limit', '512M'); // Increase memory limit for large base64 image encoding

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@multigym.com'],
            [
                'name' => 'Admin RoamFit',
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

        $mitra3 = User::firstOrCreate(
            ['email' => 'mitra3@gym.com'],
            [
                'name' => 'Mitra Tiga',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra4 = User::firstOrCreate(
            ['email' => 'mitra4@gym.com'],
            [
                'name' => 'Mitra Empat',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra5 = User::firstOrCreate(
            ['email' => 'mitra5@gym.com'],
            [
                'name' => 'Mitra Lima',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra6 = User::firstOrCreate(
            ['email' => 'mitra6@gym.com'],
            [
                'name' => 'Mitra Enam',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra7 = User::firstOrCreate(
            ['email' => 'mitra7@gym.com'],
            [
                'name' => 'Mitra Tujuh',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra8 = User::firstOrCreate(
            ['email' => 'mitra8@gym.com'],
            [
                'name' => 'Mitra Delapan',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra9 = User::firstOrCreate(
            ['email' => 'mitra9@gym.com'],
            [
                'name' => 'Mitra Sembilan',
                'password' => 'password',
                'role' => 'mitra',
                'credit_balance' => 0,
            ]
        );

        $mitra10 = User::firstOrCreate(
            ['email' => 'mitra10@gym.com'],
            [
                'name' => 'Mitra Sepuluh',
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

        // Copy images to public directory and use URLs instead of heavy Base64 strings
        $images = [];
        $publicPath = public_path('images/gyms');
        if (!file_exists($publicPath)) {
            mkdir($publicPath, 0755, true);
        }

        for ($i = 1; $i <= 8; $i++) {
            $source = database_path('seeders/images/gym' . $i . '.jpg');
            if (file_exists($source)) {
                $destName = 'gym' . $i . '.jpg';
                copy($source, $publicPath . '/' . $destName);
                // This generates http://localhost:8000/images/gyms/gym1.jpg
                $images[] = url('images/gyms/' . $destName);
            }
        }
        
        $getRandomImages = function ($count) use ($images) {
            if (empty($images)) return [];
            $count = min($count, count($images));
            $randomKeys = (array) array_rand($images, $count);
            $result = [];
            foreach ($randomKeys as $key) {
                $result[] = $images[$key];
            }
            return $result;
        };

        // Gyms
        Gym::updateOrCreate(
            ['name' => 'Gym Alpha Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Jakarta',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'photos' => $getRandomImages(3),
                'credit_price' => 10,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Beta Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(2),
                'credit_price' => 5,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Charlie Mitra 2'],
            [
                'mitra_id' => $mitra2->id,
                'location' => 'Surabaya',
                'facilities' => ['Yoga', 'Crossfit'],
                'photos' => $getRandomImages(1),
                'credit_price' => 8,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Delta Mitra 3'],
            [
                'mitra_id' => $mitra3->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(2),
                'credit_price' => 5,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Echo Mitra 4'],
            [
                'mitra_id' => $mitra4->id,
                'location' => 'Jakarta',
                'facilities' => ['Yoga', 'Crossfit'],
                'photos' => $getRandomImages(2),
                'credit_price' => 8,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Foxtrot Mitra 5'],
            [
                'mitra_id' => $mitra5->id,
                'location' => 'Surabaya',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'photos' => $getRandomImages(3),
                'credit_price' => 10,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Golf Mitra 6'],
            [
                'mitra_id' => $mitra6->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(1),
                'credit_price' => 5,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Hotel Mitra 7'],
            [
                'mitra_id' => $mitra7->id,
                'location' => 'Jakarta',
                'facilities' => ['Yoga', 'Crossfit'],
                'photos' => $getRandomImages(2),
                'credit_price' => 8,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym India Mitra 8'],
            [
                'mitra_id' => $mitra8->id,
                'location' => 'Surabaya',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'photos' => $getRandomImages(3),
                'credit_price' => 10,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Juli Mitra 9'],
            [
                'mitra_id' => $mitra9->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(1),
                'credit_price' => 5,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Kilo Mitra 10'],
            [
                'mitra_id' => $mitra10->id,
                'location' => 'Jakarta',
                'facilities' => ['Yoga', 'Crossfit'],
                'photos' => $getRandomImages(2),
                'credit_price' => 8,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Lima Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Surabaya',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'photos' => $getRandomImages(3),
                'credit_price' => 10,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Niner Mitra 1'],
            [
                'mitra_id' => $mitra1->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(2),
                'credit_price' => 5,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Eight Mitra 2'],
            [
                'mitra_id' => $mitra2->id,
                'location' => 'Jakarta',
                'facilities' => ['Yoga', 'Crossfit'],
                'photos' => $getRandomImages(2),
                'credit_price' => 8,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Four Mitra 3'],
            [
                'mitra_id' => $mitra3->id,
                'location' => 'Surabaya',
                'facilities' => ['Treadmill', 'Dumbbells', 'Sauna'],
                'photos' => $getRandomImages(3),
                'credit_price' => 10,
            ]
        );

        Gym::updateOrCreate(
            ['name' => 'Gym Two Mitra 4'],
            [
                'mitra_id' => $mitra4->id,
                'location' => 'Bandung',
                'facilities' => ['Cardio', 'Pool'],
                'photos' => $getRandomImages(1),
                'credit_price' => 5,
            ]
        );

        $this->call([
            TopupPackageSeeder::class,
        ]);
    }
}
