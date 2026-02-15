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
          ShippingZone::factory()->major()
          ->has(ShippingZoneCity::factory()->count(4) , 'cities')
          ->create();
          

          ShippingZone::factory()->secondary()
          ->has(ShippingZoneCity::factory()->count(4) , 'cities')
          ->create();
          
          ShippingZone::factory()->remote()
          ->has(ShippingZoneCity::factory()->count(4) , 'cities')
          ->create();
         
    }
}
