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
        Fit::factory()->count(10)->create();    
    }
}
