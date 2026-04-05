<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RuleBasedCollectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rule_based_collections')->insert([
            [
                'id' => 1,
                'name' => 'Top Deals',
                'slug' => 'top-deals',
                'key' => 'collections.top_deals',
                'icon' => "Start" ,
                'is_active' => true,
                'layout_config' => json_encode([
                    'headerSpacing' => 16 , 
                    'titlePosition' => "center" , 
                    'CollectionPosition' => "left",
                    'displayLimit' => 2,
                    'gap' => 32,
                    'paddingInline' => 12
                ]),
                // Matching your card_config
                'card_config' => json_encode([
                    'aspectRatio' => '1/1',
                    'borderRadius' => 40,
                    'showPrice' => false,
                    'showBadge' => true,
                    'textAlign' => 'center',
                    'hoverEffect' => 'none'
                ]),
                // Matching your rules
                'rules' => json_encode([
                    ['field' => 'discount', 'operator' => '>=', 'value' => '25']
                ]),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'Featured Footwear',
                'slug' => 'featured-footwear',
                'icon' => "Star" ,
                'key' => 'collections.featured_footwear',
                'is_active' => true,
                'layout_config' => json_encode([
                    'headerSpacing' => 16 ,
                     'titlePosition' => "center" ,
                      'CollectionPosition' => "left",
                    'displayLimit' => 3,
                    'gap' => 24,
                    'paddingInline' => 0
                ]),
                'card_config' => json_encode([
                    'aspectRatio' => '3/4',
                    'borderRadius' => 12,
                    'showPrice' => true,
                    'showBadge' => true,
                    'textAlign' => 'left',
                    'hoverEffect' => 'zoom'
                ]),
                'rules' => json_encode([
                    ['field' => 'category_id', 'operator' => '=', 'value' => 'Menswear']
                ]),
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}