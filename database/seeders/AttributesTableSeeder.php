<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttributesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Color',
                'slug' => Str::slug('Color'),
                'type' => 'color',
                'is_core' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Size',
                'slug' => Str::slug('Size'),
                'type' => 'text',
                'is_core' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Material',
                'slug' => Str::slug('Material'),
                'type' => 'text',
                'is_core' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Pattern',
                'slug' => Str::slug('Pattern'),
                'type' => 'text',
                'is_core' => false,
                'sort_order' => 4,
            ],
            [
                'name' => 'Weight',
                'slug' => Str::slug('Weight'),
                'type' => 'number',
                'is_core' => false,
                'sort_order' => 5,
            ],
        ];

        // Add timestamps
        $now = Carbon::now();
        foreach ($attributes as &$attr) {
            $attr['created_at'] = $now;
            $attr['updated_at'] = $now;
        }

        DB::table('attributes')->insert($attributes);
    }
}
