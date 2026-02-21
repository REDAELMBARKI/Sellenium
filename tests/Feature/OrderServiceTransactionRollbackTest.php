<?php

namespace Tests\Unit\Services;

use App\Exceptions\CheckoutException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

class OrderServiceTransactionRollbackTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $orderService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mock(\App\Services\ShippingService::class, function ($mock) {
            $mock->shouldReceive('calculateShipping')->andReturn(20.0);
            $mock->shouldReceive('getZoneShippingInfo')->andReturn(null);
        });

        $this->mock(\App\Services\CouponService::class, function ($mock) {
            $mock->shouldReceive('getValidCoupon')->andReturn(null);
        });

        $this->mock(\App\Services\TaxService::class, function ($mock) {
            $mock->shouldReceive('calculate')->andReturn(5.0);
        });

        $this->orderService = app(OrderService::class);
    }

  
private function partialOrderService(string $method, \Throwable $exception): OrderService
{
    $mock = Mockery::mock(OrderService::class, [
        app(\App\Services\CartService::class),
        app(\App\Services\CouponService::class),
        app(\App\Services\ShippingService::class),
        app(\App\Services\TaxService::class),
    ])
    ->makePartial()
    ->shouldAllowMockingProtectedMethods();

    $mock->shouldReceive($method)->andThrow($exception);

    $this->app->instance(OrderService::class, $mock);

    return $mock;
}





    /** @test */
    public function it_rolls_back_when_order_creation_fails(): void
    {
        $context = CheckoutContextFactory::make(user: null);
        $service = $this->partialOrderService('storeOrder', new \Exception('DB error on order'));

        $this->expectException(CheckoutException::class);
        $service->placeOrder($context);

        $this->assertEquals(0, Order::count());
        $this->assertEquals(0, OrderItem::count());
        $this->assertEquals(0, OrderAddress::count());
    }

   
    /** @test */
    public function it_rolls_back_when_storing_items_fails(): void
    {
        $context = CheckoutContextFactory::make(user: null);
        $service = $this->partialOrderService('storeOrderItems', new \Exception('DB error on items'));

        $this->expectException(CheckoutException::class);
        $service->placeOrder($context);

        $this->assertEquals(0, Order::count());
        $this->assertEquals(0, OrderItem::count());
    }

    // ─────────────────────────────────────────────────────
    // SCENARIO 3: storeOrderAddress fails
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_rolls_back_when_storing_address_fails(): void
    {
        $context = CheckoutContextFactory::make(user: null);
        $service = $this->partialOrderService('storeOrderAddress', new \Exception('DB error on address'));

        $this->expectException(CheckoutException::class);
        $service->placeOrder($context);

        $this->assertEquals(0, Order::count());
        $this->assertEquals(0, OrderItem::count());
        $this->assertEquals(0, OrderAddress::count());
    }

    // ─────────────────────────────────────────────────────
    // SCENARIO 4: updateCouponInOrderSuccess fails
    // requires method to be protected (not private) in OrderService
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_rolls_back_when_coupon_update_fails(): void
    {
        $coupon  = Coupon::factory()->create(['times_used' => 0]);
        $context = CheckoutContextFactory::make(user: null, coupon: $coupon);
        $service = $this->partialOrderService(
            'updateCouponInOrderSuccess',
            new \Exception('Coupon update failed')
        );

        $this->expectException(CheckoutException::class);
        $service->placeOrder($context);

        $this->assertEquals(0, Order::count());
        $this->assertEquals(0, OrderItem::count());
        $this->assertEquals(0, OrderAddress::count());
        $this->assertEquals(0, $coupon->fresh()->times_used);
    }

    // ─────────────────────────────────────────────────────
    // SCENARIO 5: coupon_id doesn't exist in DB
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_rolls_back_when_coupon_id_does_not_exist(): void
    {
        $context = CheckoutContextFactory::makeWithCouponId(
            user:     null,
            couponId: 99999 // non-existent
        );

        $this->expectException(CheckoutException::class);
        $this->orderService->placeOrder($context);

        $this->assertEquals(0, Order::count());
        $this->assertEquals(0, OrderItem::count());
        $this->assertEquals(0, OrderAddress::count());
    }

    // ─────────────────────────────────────────────────────
    // SANITY: happy path commits everything
    // ─────────────────────────────────────────────────────

    /** @test */
    public function it_commits_all_records_on_success(): void
    {
        $context = CheckoutContextFactory::make(user: null, itemCount: 2);

        $this->orderService->placeOrder($context);

        $this->assertEquals(1, Order::count());
        $this->assertEquals(2, OrderItem::count());
        $this->assertEquals(1, OrderAddress::count());
    }
}