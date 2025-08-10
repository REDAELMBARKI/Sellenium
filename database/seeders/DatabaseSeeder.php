<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
     
    

       $this->call([
           CategorySeeder::class,
           TagSeeder::class,
           SizeSeeder::class,
           ColorSeeder::class,
           MaterialSeeder::class,
           FitSeeder::class,
           UserSeeder::class,
          //  OrderSeeder::class,
          //  PromotionSeeder::class,
          //  ReviewSeeder::class,
          //  CartSeeder::class,
          //  WishListSeeder::class,
    
        // Add more seeders here...
      ]);
    }
}
