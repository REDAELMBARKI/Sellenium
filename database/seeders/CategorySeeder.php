<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    private $catgeries = [
       "Fashion & Apparel"  , 
        "Electronics & Gadgets" ,
         "Beauty & Personal Care" ,
        "Perfumes" ,
        "Home & Living" ,
         "Sports & Outdoors" ,
        "Toys & Games" ,
        "Jewelry & Accessories" ,
        "Baby & Kids" 
     ];

    public function run(): void
    {
           $records = array_map(function($c) {
            return [
                'name' => $c,
                'slug' => Str::slug($c),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $this->catgeries);

        // Insert all at once
        Category::insert($records);
    }
}
