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
        $factoryPayloads = [
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

        foreach ($factoryPayloads as $config) {
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