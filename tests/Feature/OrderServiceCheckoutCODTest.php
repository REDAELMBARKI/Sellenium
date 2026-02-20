<?php

namespace Tests\Unit\Services;

use App\Exceptions\CheckoutException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use App\Services\Discount\CouponService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

class OrderServiceCheckoutCODTest extends TestCase
{
    use RefreshDatabase;

  
    private OrderService $orderService;

    protected function setUp(): void  // ← only in the test class
    {
        parent::setUp();

        $this->mock(\App\Services\ShippingService::class, function ($mock) {
            $mock->shouldReceive('calculateShipping')->andReturn(20.0);
            $mock->shouldReceive('getZoneShippingInfo')->andReturn(null);
        });

        $this->mock(CouponService::class, function ($mock) {
            $mock->shouldReceive('getValidCoupon')->andReturn(null);
        });

        $this->mock(\App\Services\TaxService::class, function ($mock) {
            $mock->shouldReceive('calculate')->andReturn(5.0);
        });

        $this->orderService = app(OrderService::class);
    }


    // ─────────────────────────────────────────────────────
    // HAPPY PATH
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_creates_a_cod_order_for_a_guest_user(): void
    {
        $context = CheckoutContextFactory::make(user: null);

        $order = $this->orderService->checkoutCOD($context);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertNull($order->user_id);
        $this->assertEquals('cod', $order->payment_method);
    }

    /** @test */
    public function it_creates_a_cod_order_for_an_authenticated_user(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make(user: $user);

        $order = $this->orderService->checkoutCOD($context);

        $this->assertEquals($user->id, $order->user_id);
        $this->assertEquals('cod', $order->payment_method);
    }

    // ─────────────────────────────────────────────────────
    // TRACKING TOKEN
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_generates_a_uuid_tracking_token_for_guest_orders(): void
    {
        $context = CheckoutContextFactory::make(user: null);

        $order = $this->orderService->checkoutCOD($context);

        $this->assertNotNull($order->tracking_token);
        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/',
            $order->tracking_token
        );
    }

    /** @test */
    public function it_does_not_generate_a_tracking_token_for_authenticated_users(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make(user: $user);

        $order = $this->orderService->checkoutCOD($context);

        $this->assertNull($order->tracking_token);
    }

    // ─────────────────────────────────────────────────────
    // ORDER NUMBER
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_generates_a_unique_order_number(): void
    {
        $context = CheckoutContextFactory::make(user: null);

        $order1 = $this->orderService->checkoutCOD($context);
        $order2 = $this->orderService->checkoutCOD($context);

        $this->assertNotEquals($order1->order_number, $order2->order_number);
        $this->assertStringStartsWith('ORD-', $order1->order_number);
        $this->assertStringStartsWith('ORD-', $order2->order_number);
    }

    // ─────────────────────────────────────────────────────
    // ORDER ITEMS
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_stores_the_correct_number_of_order_items(): void
    {
        $context = CheckoutContextFactory::make(user: null, itemCount: 3);

        $order = $this->orderService->checkoutCOD($context);
        $order->load('items');

        $this->assertCount(3, $order->items);
    }

    /** @test */
    public function it_stores_price_snapshot_and_product_name_on_items(): void
    {
        $context = CheckoutContextFactory::make(user: null, itemCount: 1);

        $order = $this->orderService->checkoutCOD($context);
        $order->load('items');

        $item = $order->items->first();
        $this->assertNotNull($item->price_snapshot);
        $this->assertNotNull($item->product_name);
    }

    // ─────────────────────────────────────────────────────
    // ADDRESS
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_stores_the_shipping_address(): void
    {
        $context = CheckoutContextFactory::make(user: null);

        $order = $this->orderService->checkoutCOD($context);
        $order->load('address');

        $this->assertNotNull($order->address);
        $this->assertEquals('Casablanca', $order->address->city);
        $this->assertEquals('John', $order->address->first_name);
        $this->assertEquals('Doe', $order->address->last_name);
    }

    // ─────────────────────────────────────────────────────
    // COUPON
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_increments_coupon_times_used_when_valid_coupon_is_applied(): void
    {
        $coupon  = Coupon::factory()->create(['times_used' => 0]);
        $context = CheckoutContextFactory::make(user: null, coupon: $coupon);

        $this->orderService->checkoutCOD($context);

        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    /** @test */
    public function it_sets_discount_to_zero_when_no_coupon_is_applied(): void
    {
        $context = CheckoutContextFactory::make(user: null, coupon: null);

        $order = $this->orderService->checkoutCOD($context);

        $this->assertEquals(0.0, (float) $order->discount_amount);
    }

    // ─────────────────────────────────────────────────────
    // TOTAL CALCULATION
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_calculates_total_correctly_with_shipping_and_tax(): void
    {
        $context = CheckoutContextFactory::make(user: null, coupon: null);

        $order = $this->orderService->checkoutCOD($context);
        $order->load('items');

        $expected = $order->items->sum(fn($i) => (float) $i->subtotal)
                  + (float) $order->shipping_cost
                  + (float) $order->tax
                  - (float) $order->discount_amount;

        $this->assertEquals(
            round($expected, 2),
            round((float) $order->total_amount, 2)
        );
    }

   
}