<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Coupon;
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
           CategorySeeder::class,
           ProductSeeder::class ,
           AttributesTableSeeder::class ,
           AttributeValuesSeeder::class ,
           ProductVariantSeeder::class ,
           CouponSeeder::class ,
           PromotionSeeder::class ,
           OrderSeeder::class ,
            CartSeeder::class,
            ShippingSettingSeeder::class ,
            TagSeeder::class,
            ShippingZoneSeeder::class ,
          //  ReviewSeeder::class,
          //  SizeSeeder::class,
          //  ColorSeeder::class,
          //  MaterialSeeder::class,
          //  FitSeeder::class,
          //  UserSeeder::class,
          //  OrderSeeder::class,
          //  PromotionSeeder::class,
          //  WishListSeeder::class,
    
        // Add more seeders here...
      ]);
    }
}
