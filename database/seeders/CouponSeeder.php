<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
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
        Coupon::factory()->active()->forProducts([1, 2, 5])->create();
        Coupon::factory()->exhausted()->create();
         Coupon::factory()->active()->percentage()->create(['code' => 'SAVE10']);
        Coupon::factory()->active()->fixed()->create(['code' => 'FLAT50']);

        // ── 2. Expired & inactive (for testing / admin visibility) ──────
        Coupon::factory()->expired()->create(['code' => 'EXPIRED20']);
        Coupon::factory()->inactive()->create(['code' => 'DISABLED30']);
        Coupon::factory()->notYetValid()->create(['code' => 'UPCOMING15']);

        // ── 3. Usage limited coupons ────────────────────────────────────
        Coupon::factory()->active()->exhausted()->create(['code' => 'SOLDOUT']);
        Coupon::factory()->active()->requiresLogin(2)->create(['code' => 'MEMBER20']);

        // ── 4. Minimum order amount ─────────────────────────────────────
        Coupon::factory()->active()->withMinimumAmount(200)->percentage()->create(['code' => 'MIN200']);
        Coupon::factory()->active()->withMinimumAmount(500)->fixed()->create(['code' => 'MIN500']);

        // ── 5. Minimum items ────────────────────────────────────────────
        Coupon::factory()->active()->withMinimumItems(3)->percentage()->create(['code' => 'BULK3']);
        Coupon::factory()->active()->withMinimumItems(5)->fixed()->create(['code' => 'BULK5']);

        // ── 6. Product-specific (uses real product IDs if they exist) ───
        $productIds = Product::limit(3)->pluck('id')->toArray();
        if (!empty($productIds)) {
            Coupon::factory()->active()->forProducts($productIds)->create(['code' => 'PRODUCT10']);
        }

        // ── 7. Category-specific ────────────────────────────────────────
        $categoryIds = Category::limit(2)->pluck('id')->toArray();
        if (!empty($categoryIds)) {
            Coupon::factory()->active()->forCategories($categoryIds)->create(['code' => 'CAT15']);
        }

        // ── 8. Unlimited / no restrictions (safe to use always) ─────────
        Coupon::factory()->unlimited()->create(['code' => 'FREESHIP']);

        // ── 9. Bulk random ones for a realistic dataset ─────────────────
        Coupon::factory()->active()->count(10)->create();
        Coupon::factory()->expired()->count(5)->create();
    }
}
