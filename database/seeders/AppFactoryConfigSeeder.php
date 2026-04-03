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
                'config_key' => 'banners.spring_2026',
                'description' => 'Factory default for the Spring Collection 2026 hero banner',
                'payload' => [
                    'name' => 'Spring Collection 2026',
                    'key' => 'spring_2026',
                    'slug' => 'spring-2026',
                    'order' => 0,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '12px',
                    'bg_color' => '#FF5733',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '50',
                            'is_visible' => true,
                            'bg_color' => '#1a1a1a',
                            'elements' => [
                                'eyebrow'   => ['text' => 'NEW ARRIVALS', 'color' => '#ffd700', 'visible' => true],
                                'title'     => ['text' => 'Premium Gear', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Discover the durability and style of our latest 2026 release.', 'color' => '#cccccc', 'visible' => true],
                                'button'    => ['text' => 'Shop Now', 'bg_color' => '#ffffff', 'text_color' => '#000000', 'visible' => true]
                            ]
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '50',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/spring_main/1200/800',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                            'secondary_media' => [
                                'url' => 'https://picsum.photos/seed/spring_side/800/600',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.urban_2026',
                'description' => 'Factory default for the Urban Vibes Drop promotional banner',
                'payload' => [
                    'name' => 'Urban Vibes Drop',
                    'key' => 'urban_2026',
                    'slug' => 'urban-vibes',
                    'order' => 1,
                    'direction' => 'rtl',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '12px',
                    'bg_color' => '#000000',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '35',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/urban_main/1920/1080',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                        ],
                        [
                            'slot_key' => 'middle',
                            'width' => '65',
                            'is_visible' => true,
                            'bg_color' => '#111111',
                            'elements' => [
                                'eyebrow'   => ['text' => 'LIMITED DROP', 'color' => '#fbbf24', 'visible' => true],
                                'title'     => ['text' => 'Urban Vibes', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Street-ready essentials for the modern explorer.', 'color' => '#9ca3af', 'visible' => true],
                                'button'    => ['text' => 'VIEW DROP', 'bg_color' => '#fbbf24', 'text_color' => '#000000', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.flash_sale_2026',
                'description' => 'Factory default for the Flash Sale 2026 emergency banner',
                'payload' => [
                    'name' => 'Flash Sale 2026',
                    'key' => 'flash_sale_2026',
                    'slug' => 'flash-sale',
                    'order' => 2,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '0px',
                    'bg_color' => '#dc2626',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '100',
                            'is_visible' => true,
                            'bg_color' => '#dc2626',
                            'elements' => [
                                'eyebrow'   => ['text' => 'HURRY UP!', 'color' => '#ffffff', 'visible' => true],
                                'title'     => ['text' => '60% OFF EVERYTHING', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Use code FLASH60 at checkout. Ends at midnight.', 'color' => '#fee2e2', 'visible' => true],
                                'button'    => ['text' => 'CLAIM OFFER', 'bg_color' => '#000000', 'text_color' => '#ffffff', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.minimal_2026',
                'description' => 'Factory default for the Minimalist Showcase banner',
                'payload' => [
                    'name' => 'Minimalist Showcase',
                    'key' => 'minimal_2026',
                    'slug' => 'minimalist-showcase',
                    'order' => 3,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '16:9',
                    'border_radius' => '20px',
                    'bg_color' => '#ffffff',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '50',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/min_main/1000/1000',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                            'secondary_media' => [
                                'url' => 'https://picsum.photos/seed/min_side/500/500',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ]
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '50',
                            'is_visible' => true,
                            'bg_color' => '#f9fafb',
                            'elements' => [
                                'eyebrow'   => ['text' => 'COLLECTION', 'color' => '#6b7280', 'visible' => true],
                                'title'     => ['text' => 'The Minimalist', 'color' => '#111827', 'visible' => true],
                                'paragraph' => ['text' => 'Clean lines and premium materials.', 'color' => '#4b5563', 'visible' => true],
                                'button'    => ['text' => 'EXPLORE', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ]
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