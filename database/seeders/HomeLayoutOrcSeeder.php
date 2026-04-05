<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\HomeLayoutOrc;
use App\Models\RuleBasedCollection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomeLayoutOrcSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
              [
                "sortable_id" => 1 ,
                "sortable_type" =>  'collection' ,
                "order" => 1
              ],
              [
                "sortable_id" => 1 ,
                "sortable_type" =>  'banner' ,
                "order" => 2
              ] ,
              [
                "sortable_id" => 2 ,
                "sortable_type" =>  'collection' ,
                "order" => 3
              ],
              [
                "sortable_id" => 2 ,
                "sortable_type" =>  'banner' ,
                "order" => 4
              ] ,
              ];

        HomeLayoutOrc::insert($sections);
    }
}
