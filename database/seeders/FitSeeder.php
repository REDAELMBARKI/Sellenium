<?php

namespace Database\Seeders;

use App\Models\Fit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fits  = Fit::factory()->count(10)->make()->toArray();
        Fit::insertOrIgnore($fits);
    }
}
