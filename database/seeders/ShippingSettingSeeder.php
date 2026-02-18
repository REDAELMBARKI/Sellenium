<?php

namespace Database\Seeders;

use App\Models\ShippingSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       // amount based free shipping
        ShippingSetting::factory()->freeByAmount(500)->create();

        // items based
        ShippingSetting::factory()->freeByItems(5)->create();

        // either rule met
        ShippingSetting::factory()->freeByEither(500, 5)->create();

        // both rules must be met + weight pricing
        ShippingSetting::factory()->freeByBoth(500, 5)->withWeightPricing(2, 5)->create();

        // no free shipping at all
        ShippingSetting::factory()->noFreeShipping()->withWeightPricing()->create();

    }
}
