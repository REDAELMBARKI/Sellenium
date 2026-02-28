<?php

namespace Database\Seeders;

use App\Models\Promotion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Promotion::factory(10)->active()->create();
        Promotion::factory(5)->expired()->create();
        Promotion::factory(3)->freeShipping()->active()->create();
        Promotion::factory(5)->highPriority()->active()->create();

        // Chain states together
        Promotion::factory(3)->percentage()->highPriority()->active()->create();
    }
}
