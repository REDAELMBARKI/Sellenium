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
                'collection' => "thumbnail" ,
                'url' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/600/400',
            ]);

            // covers
            $product->covers()->createMany([
        
                ['collection' => "gallery" ,'url' =>  'https://picsum.photos/seed/' . rand(1, 1000) . '/600/400'],
                ['collection' => "gallery" ,'url' =>  'https://picsum.photos/seed/' . rand(1, 1000) . '/600/400'],
            ]);


            $product->tags()->sync([2, 3 , 4]);
            $product->subCategories()->sync([2, 3 , 4]);
        
          
        });
    }
}
