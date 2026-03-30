<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AppFactoryConfig;



class AppFactoryConfigSeeder extends Seeder
{
    /**
     * Seed the application's developer-defined factory configurations.
     */
    public function run(): void
    {
        $collections_factoryPayloads = [
            [
                'config_key' => 'collections.top_deals',
                'description' => 'Factory default for the Top Deals rule-based collection',
                'payload' => [
                    'section_type' => 'deals',
                    'name' => 'Top Deals',
                    'active' => true,
                    'layout_config' => [
                        'displayLimit' => 4, 
                        'gap' => 16, 
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'aspectRatio' => '3/4', 
                        'borderRadius' => 12, 
                        'showPrice' => true, 
                        'showBadge' => true, 
                        'textAlign' => 'left', 
                        'hoverEffect' => 'zoom'
                    ],
                    'rules' => [
                        ['id' => 'f1', 'field' => 'discount', 'operator' => '>=', 'value' => '25']
                    ],
                ]
            ],
            [
                'config_key' => 'collections.featured_footwear',
                'description' => 'Factory default for the Featured Footwear category section',
                'payload' => [
                    'section_type' => 'category',
                    'name' => 'Featured Footwear',
                    'active' => true,
                    'layout_config' => [
                        'displayLimit' => 3, 
                        'gap' => 24, 
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'aspectRatio' => '3/4', 
                        'borderRadius' => 12, 
                        'showPrice' => true, 
                        'showBadge' => true, 
                        'textAlign' => 'left', 
                        'hoverEffect' => 'zoom'
                    ],
                    'rules' => [
                        ['id' => 'f2', 'field' => 'category_id', 'operator' => '=', 'value' => 'Menswear']
                    ],
                ]
            ],
           
        ];
        $banners_factoryPayloads = [
            [
                'config_key' => 'banners.main_hero',
                'description' => 'Primary hero banner for the landing page',
                'payload' => [
                    'key' => 'home_hero',
                    'slug' => 'summer-collection-2026',
                    'order' => 1,
                    'direction' => 'ltr',
                    'name' => 'Summer Collection 2026',
                    'subname' => 'Experience the heat with our new arrivals.',
                    'is_active' => true,
                    'main_media_url' => 'https://picsum.photos/seed/main_1/1920/1080',
                    'secondary_media_url' => 'https://picsum.photos/seed/sec_1/800/600',
                ]
            ],
            [
                'config_key' => 'banners.seasonal_promo',
                'description' => 'Secondary promotional banner for seasonal sales',
                'payload' => [
                    'key' => 'sale_banner',
                    'slug' => 'flash-sale-50',
                    'order' => 2,
                    'direction' => 'rtl',
                    'name' => 'Flash Sale',
                    'subname' => 'Up to 50% off for a limited time only.',
                    'is_active' => true,
                    'main_media_url' => 'https://picsum.photos/seed/main_2/1920/1080',
                    'secondary_media_url' => null,
                ]
            ],
        ];
         

        
        $configs = array_merge($collections_factoryPayloads, $banners_factoryPayloads);
        foreach ($configs as $config) {
            AppFactoryConfig::updateOrCreate(
                ['config_key' => $config['config_key']],
                [
                    'description' => $config['description'],
                    'payload'     => $config['payload'],
                    'is_active'   => true,
                ]
            );
        }
    }
}