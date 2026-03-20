<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Coupon;
use App\Models\ProductAttribute;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
     
    

       $this->call([
           storeSettingSeeder::class,
           BadgeSeeder::class ,
           UserSeeder::class ,
           MediaSeeder::class ,
           TagSeeder::class,
           CategorySeeder::class,
           ProductSeeder::class ,
           ProductVariantSeeder::class ,
           CouponSeeder::class ,
           PromotionSeeder::class ,
           OrderSeeder::class ,
            CartSeeder::class,
            ShippingSettingSeeder::class ,
            ShippingZoneSeeder::class ,
            VariantOptionSeeder::class ,
            ReviewSeeder::class,
            AttributesSeeder::class , 

          //  WishListSeeder::class,
    
        // Add more seeders here...
      ]);
    }
}
