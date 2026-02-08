<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Product;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            Media::factory()->create([
                'url' => "storage/products/{$i}.jpg",
                'mediaable_type' => Product::class,
                'mediaable_id' => $i,
            ]);
        }
    }
}