<?php

namespace Database\Seeders;

use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use Database\Factories\ShippingZoneCityFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {    
         $cities1 = collect(['Casablanca', 'Rabat', 'Marrakech', 'Agadir', 'Fes'])
         ->shuffle();

        $cities2 = collect(['Tanger', 'Meknes'])
            ->shuffle();

        $cities4 = collect(['Oujda', 'Kenitra', 'Tetouan', 'Safi'])
            ->shuffle();

        $cities1->each(function($city) {
            ShippingZone::factory()->major()
                ->has(ShippingZoneCity::factory()->state(['city' => $city]), 'cities')
                ->create();
        });

        $zone2 = ShippingZone::factory()->secondary()->create();
        $cities2->each(fn($city) => ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone2->id,
        ]));

        $zone4 = ShippingZone::factory()->remote()->create();
        $cities4->each(fn($city) => ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone4->id,
        ]));
         
    }
}
