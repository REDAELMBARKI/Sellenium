<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            // ProductSeeder.php
           Product::factory(10)->create()->each(function ($product) {

            // thumbnail
            $product->thumbnail()->create([
                'url' => '/storage/products/1.jpg',
            ]);

            // covers
            $product->covers()->createMany([
                ['url' =>  '/storage/products/2.jpg'],
                ['url' =>  '/storage/products/3.jpg'],
            ]);

           

          
        });
    }
}
