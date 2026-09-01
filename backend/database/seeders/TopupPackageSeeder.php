<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TopupPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Paket Pemula',
                'price_idr' => 50000,
                'credits' => 50,
                'bonus_credits' => 0,
            ],
            [
                'name' => 'Paket Reguler',
                'price_idr' => 100000,
                'credits' => 100,
                'bonus_credits' => 5,
            ],
            [
                'name' => 'Paket Pro',
                'price_idr' => 200000,
                'credits' => 200,
                'bonus_credits' => 20,
            ],
            [
                'name' => 'Paket Mega',
                'price_idr' => 500000,
                'credits' => 500,
                'bonus_credits' => 75,
            ],
        ];

        foreach ($packages as $package) {
            \App\Models\TopupPackage::create($package);
        }
    }
}
