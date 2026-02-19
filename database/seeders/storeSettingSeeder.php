<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class storeSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaultSettings = [
            // Tax
            ['key' => 'tva_enabled',     'value' => 'false'],
            ['key' => 'tva_rate',        'value' => '20'],

            // Payments
            ['key' => 'cod_enabled',     'value' => 'true'],
            ['key' => 'payment_enabled', 'value' => 'true'],

            // Store
            ['key' => 'currency',        'value' => 'MAD'],

            // Theme
            ['key' => 'theme_id',        'value' => '1'],
        ];

        DB::table('store_settings')->insert($defaultSettings);
    }
}