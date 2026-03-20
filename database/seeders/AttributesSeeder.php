<?php

namespace Database\Seeders;


use App\Models\PAttr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'key' => 'Color',
                'type' => 'button',
            ],
            [
                'key' => 'Size',
                'type' => 'radio',
            ],
            [
                'key' => 'Material',
                'type' => 'button',
            ],
           
        ];

        // Add timestamps
        $now = Carbon::now();
        foreach ($attributes as &$attr) {
            $attr['created_at'] = $now;
            $attr['updated_at'] = $now;
        }

        PAttr::insert($attributes);
    }
}
