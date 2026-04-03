<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\BannerSlot;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                "banner" => [
                    'name'          => 'Spring Collection 2026',
                    'key'           => 'spring_2026',
                    'slug'          => 'spring-2026',
                    'order'         => 0,
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '21:9',
                    'border_radius' => '12px',
                    'bg_color'      => '#FF5733',
                ],
                "slots" => [
                    [
                        'slot_key'   => 'left',
                        'width'      => "50",
                        'is_visible' => true,
                        'bg_color'   => '#1a1a1a',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'NEW ARRIVALS', 'color' => '#ffd700', 'visible' => true],
                            'title'     => ['text' => 'Premium Gear', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Discover the durability and style of our latest 2026 release.', 'color' => '#cccccc', 'visible' => true],
                            'button'    => ['text' => 'Shop Now', 'bg_color' => '#ffffff', 'text_color' => '#000000', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'   => 'middle',
                        'width'      => '0',
                        'is_visible' => false,
                        'bg_color'   => '#222222',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'SUBTITLE', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => 'Middle Section', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Add your content here.', 'color' => '#cccccc', 'visible' => true],
                            'button'    => ['text' => 'Explore', 'bg_color' => '#ffffff', 'text_color' => '#000000', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'          => 'right',
                        'width'             => "50",
                        'is_visible'        => true,
                        'main_media_id'     => 4,
                        'secondary_media_id'=> 5,
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'Urban Vibes Drop',
                    'key'           => 'urban_2026',
                    'slug'          => 'urban-vibes',
                    'order'         => 1,
                    'direction'     => 'rtl',
                    'is_active'     => true,
                    'aspect_ratio'  => '21:9',
                    'border_radius' => '12px',
                    'bg_color'      => '#000000',
                ],
                "slots" => [
                    [
                        'slot_key'      => 'left',
                        'width'         => '35',
                        'is_visible'    => true,
                        'main_media_id' => 6,
                    ],
                    [
                        'slot_key'   => 'middle',
                        'width'      => '65',
                        'is_visible' => true,
                        'bg_color'   => '#111111',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'LIMITED DROP', 'color' => '#fbbf24', 'visible' => true],
                            'title'     => ['text' => 'Urban Vibes', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Street-ready essentials for the modern explorer.', 'color' => '#9ca3af', 'visible' => true],
                            'button'    => ['text' => 'VIEW DROP', 'bg_color' => '#fbbf24', 'text_color' => '#000000', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'   => 'right',
                        'width'      => '0',
                        'is_visible' => false,
                        'bg_color'   => '#1a1a1a',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'EXTRA', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => 'Right Section', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Add your content here.', 'color' => '#cccccc', 'visible' => true],
                            'button'    => ['text' => 'Explore', 'bg_color' => '#ffffff', 'text_color' => '#000000', 'visible' => true],
                        ],
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'Flash Sale 2026',
                    'key'           => 'flash_sale_2026',
                    'slug'          => 'flash-sale',
                    'order'         => 2,
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '21:9',
                    'border_radius' => '0px',
                    'bg_color'      => '#dc2626',
                ],
                "slots" => [
                    [
                        'slot_key'   => 'left',
                        'width'      => '100',
                        'is_visible' => true,
                        'bg_color'   => '#dc2626',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'HURRY UP!', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => '60% OFF EVERYTHING', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Use code FLASH60 at checkout. Ends at midnight.', 'color' => '#fee2e2', 'visible' => true],
                            'button'    => ['text' => 'CLAIM OFFER', 'bg_color' => '#000000', 'text_color' => '#ffffff', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'   => 'middle',
                        'width'      => '0',
                        'is_visible' => false,
                        'bg_color'   => '#b91c1c',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'DETAILS', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => 'Middle Section', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Add extra content here.', 'color' => '#fee2e2', 'visible' => true],
                            'button'    => ['text' => 'Learn More', 'bg_color' => '#ffffff', 'text_color' => '#dc2626', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'   => 'right',
                        'width'      => '0',
                        'is_visible' => false,
                        'bg_color'   => '#991b1b',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'OFFER', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => 'Right Section', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Add extra content here.', 'color' => '#fee2e2', 'visible' => true],
                            'button'    => ['text' => 'Grab Deal', 'bg_color' => '#ffffff', 'text_color' => '#dc2626', 'visible' => true],
                        ],
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'Minimalist Showcase',
                    'key'           => 'minimal_2026',
                    'slug'          => 'minimalist-showcase',
                    'order'         => 3,
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '16:9',
                    'border_radius' => '20px',
                    'bg_color'      => '#ffffff',
                ],
                "slots" => [
                    [
                        'slot_key'           => 'left',
                        'width'              => "50",
                        'is_visible'         => true,
                        'main_media_id'      => 7,
                        'secondary_media_id' => 8,
                    ],
                    [
                        'slot_key'   => 'middle',
                        'width'      => '0',
                        'is_visible' => false,
                        'bg_color'   => '#f3f4f6',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'FEATURED', 'color' => '#6b7280', 'visible' => true],
                            'title'     => ['text' => 'Middle Section', 'color' => '#111827', 'visible' => true],
                            'paragraph' => ['text' => 'Add your content here.', 'color' => '#4b5563', 'visible' => true],
                            'button'    => ['text' => 'Discover', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'   => 'right',
                        'width'      => "50",
                        'is_visible' => true,
                        'bg_color'   => '#f9fafb',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'COLLECTION', 'color' => '#6b7280', 'visible' => true],
                            'title'     => ['text' => 'The Minimalist', 'color' => '#111827', 'visible' => true],
                            'paragraph' => ['text' => 'Clean lines and premium materials.', 'color' => '#4b5563', 'visible' => true],
                            'button'    => ['text' => 'EXPLORE', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($data as $item) {
            $banner = Banner::create($item['banner']);
            foreach ($item['slots'] as $slotData) {
                $banner->slots()->create($slotData);
            }
        }
    }
}