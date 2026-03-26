<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSectionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('catalog_sections')->insert([
            [
                'name' => 'Top Deals',
                'icon' => null,
                'criteria' => json_encode([
                    ['field' => 'discount', 'operator' => '>=', 'value' => 20],
                    ['field' => 'price', 'operator' => '<', 'value' => 100]
                ]),
                'is_active' => true,
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Picked For You',
                'icon' => null,
                'criteria' => json_encode([
                    ['field' => 'stock', 'operator' => '>', 'value' => 0],
                    ['field' => 'category_id', 'operator' => '=', 'value' => 3]
                ]),
                'is_active' => true,
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Featured',
                'icon' => null,
                'criteria' => json_encode([
                    ['field' => 'brand_id', 'operator' => '=', 'value' => 5],
                ]),
                'is_active' => true,
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}