<?php

namespace Tests\Unit\Services;

use App\Models\Product;
use App\Models\Promotion;
use App\Services\CartService;
use App\Services\Discount\PromotionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionServiceTest extends TestCase
{
    use RefreshDatabase;

    private PromotionService $promotionService;

    protected function setUp(): void
    {
        parent::setUp();

        $cartService = $this->mock(CartService::class, function ($mock) {
            // Default cart subtotal 500 for simplicity
            $mock->shouldReceive('calculateCartItemsSubtotal')->andReturn(500);
            $mock->shouldReceive('calculateCartSubQuantity')->andReturn(3);
        });

        $this->promotionService = new PromotionService($cartService);
    }

    /** @test */
    public function it_returns_null_when_no_promotions_exist(): void
    {
        $result = $this->promotionService->getBestPromotion([]);
        $this->assertNull($result);
    }

    /** @test */
    public function it_applies_percentage_promotion_correctly(): void
    {
        $promotion = Promotion::factory()->percentage()->create();
        $items = $this->makeItems();

        $best = $this->promotionService->getBestPromotion($items);

        $this->assertEquals($promotion->id, $best['promotion']);
        $this->assertEquals($promotion->value * 500, $best['discount']);
    }

    /** @test */
    public function it_applies_fixed_promotion_correctly(): void
    {
        $promotion = Promotion::factory()->fixed()->create();
        $items = $this->makeItems();

        $best = $this->promotionService->getBestPromotion($items);

        $this->assertEquals($promotion->id, $best['promotion']);
        $this->assertEquals((float)$promotion->value, $best['discount']);
    }

    /** @test */
    public function it_ignores_expired_promotions(): void
    {
        $expired = Promotion::factory()->expired()->create();
        $valid = Promotion::factory()->fixed()->create();
        $items = $this->makeItems();

        $best = $this->promotionService->getBestPromotion($items);

        $this->assertEquals($valid->id, $best['promotion']);
    }

    /** @test */
    public function it_ignores_promotions_that_are_not_yet_valid(): void
    {
        $future = Promotion::factory()->notYetValid()->create();
        $items = $this->makeItems();

        $best = $this->promotionService->getBestPromotion($items);
        $this->assertNull($best);
    }

    /** @test */
    public function it_checks_minimum_order_amount(): void
    {
        $promotion = Promotion::factory()->fixed()->withMinimumAmount(600)->create();
        $items = $this->makeItems(); // subtotal = 500

        $best = $this->promotionService->getBestPromotion($items);
        $this->assertNull($best);
    }

    /** @test */
    public function it_checks_minimum_items(): void
    {
        $promotion = Promotion::factory()->fixed()->withMinimumItems(5)->create();
        $items = $this->makeItems(); // count = 3, subquantity = 3

        $best = $this->promotionService->getBestPromotion($items);
        $this->assertNull($best);
    }

    /** @test */
    public function it_checks_product_and_category_restrictions(): void
    {
        $productA = Product::factory()->create();
        $productB = Product::factory()->create();

        $promotion = Promotion::factory()->forProducts([$productA->id])->create();

        $items = [
            (object)['product' => ['id' => $productB->id, 'sub_categories' => [], 'nich_category' => []]]
        ];

        $best = $this->promotionService->getBestPromotion($items);
        $this->assertNull($best);
    }

    /** @test */
    public function it_picks_highest_discount_when_multiple_promotions_exist(): void
    {
        $promo1 = Promotion::factory()->fixed()->create(['value' => 50]);
        $promo2 = Promotion::factory()->percentage()->create(['value' => 0.2]); // 20% of 500 = 100

        $items = $this->makeItems();

        $best = $this->promotionService->getBestPromotion($items);

        $this->assertEquals($promo2->id, $best['promotion']);
        $this->assertEquals(100, $best['discount']);
    }

    /** @test */
    public function it_increments_times_used_on_order_success(): void
    {
        $promotion = Promotion::factory()->fixed()->create(['times_used' => 0]);
        $this->promotionService->updateOnOrderSuccess($promotion->id);

        $this->assertEquals(1, $promotion->fresh()->times_used);
    }

    /** ── Helper to create dummy cart items ── */
    private function makeItems(): array
    {
        $product = Product::factory()->create();
        return [
            (object)[
                'product' => $product->toArray(),
                'quantity' => 2,
                'price_snapshot' => 100,
                'subtotal' => 200
            ],
            (object)[
                'product' => $product->toArray(),
                'quantity' => 1,
                'price_snapshot' => 100,
                'subtotal' => 100
            ],
        ];
    }
}