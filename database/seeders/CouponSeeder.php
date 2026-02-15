<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Coupon::factory()->active()->percentage()->create();
        Coupon::factory()->expired()->create();
        Coupon::factory()->active()->forProducts([1, 2, 5])->create();
        Coupon::factory()->exhausted()->create();
    }
}
