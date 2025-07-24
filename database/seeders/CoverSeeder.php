<?php

namespace Database\Seeders;

use App\Models\Cover;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CoverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $product = Product::inRandomOrder()->first();  
       $basimg = Str::random()   
       
    }
}
