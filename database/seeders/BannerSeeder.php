<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['home_hero', 'sale_promo', 'footer_banner'];
        $direction = ['ltr', 'rtl'];
        foreach ($categories as $index => $key) {
            // 1. Create fake Media for the Main image
            $mainMedia = Media::create([
                'collection' => 'banner',
                'url' => "https://picsum.photos/seed/" . rand(1, 1000) . "/1920/1080",
                'media_type' => 'image',
                'disk' => 'public',
                'is_temporary' => false,
            ]);

       
            $secondaryMedia = Media::create([
                'collection' => 'banner',
                'url' => "https://picsum.photos/seed/" . rand(1, 1000) . "/800/600",
                'media_type' => 'image',
                'disk' => 'public',
                'is_temporary' => false,
            ]);

            // 3. Create the Banner
            $banner = Banner::create([
                'key'                => $key,
                'slug'               => Str::slug($key),
                'order'              => $index,
                'direction'          => $direction[array_rand($direction)],
                'name'              => "Big Seasonal " . ucfirst(str_replace('_', ' ', $key)),
                'subname'           => "Don't miss out on our latest deals and discounts.",
                'main_media_id'      => $mainMedia->id,
                'secondary_media_id' => $secondaryMedia->id,
                'is_active'          => true,
            ]);
            $mainMedia->update([
                'mediaable_type' => Banner::class,
                'mediaable_id'   => $banner->id
            ]);
        }
    }
}