<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VariantOptionSeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            'size'  => ['XS', 'S', 'M', 'L', 'XL'],

            'color' => [
                ['name' => 'Red',  'hex' => '#ff0000ff'],
                ['name' => 'Blue', 'hex' => '#0015ffff'],
            ],

            'ram'   => ['4GB', '8GB', '16GB', '32GB'],
        ];

        foreach ($parents as $parentKey => $children) {

            $parentId = DB::table('variants_options_settings')->insertGetId([
                'key' => $parentKey,
                'value' => null,
                'hex' => null, // important
                'parent_id' => null,
            ]);

            foreach ($children as $childValue) {

                // If color (array with name + hex)
                if ($parentKey === 'color') {
                    DB::table('variants_options_settings')->insert([
                        'key' => $parentKey,
                        'value' => $childValue['name'],
                        'hex' => $childValue['hex'],
                        'parent_id' => $parentId,
                    ]);
                } 
                // Normal options
                else {
                    DB::table('variants_options_settings')->insert([
                        'key' => $parentKey,
                        'value' => $childValue,
                        'hex' => null,
                        'parent_id' => $parentId,
                    ]);
                }
            }
        }
    }
}