<?php

namespace Tests\Feature;

use App\Exceptions\CheckoutException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

class OrderServiceSuccessRedirectionTest extends TestCase
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

    // ── AUTH USER ORDERS ───────────────────────────────

    /** @test */
    public function auth_user_can_see_own_order(): void
    {
        $user = User::factory()->create();
        $coupon = Coupon::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        $response = $this->actingAs($user)
                        ->get(route('track.auth', ['order' => $order->id]));

        $response->assertStatus(200);
    }

    /** @test */
    public function auth_user_gets_403_on_another_users_order(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $owner->id]);

        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        $response = $this->actingAs($intruder)
                         ->get(route('track.auth', $order->id));

        $response->assertStatus(403);
    }

    /** @test */
    public function guest_cannot_access_auth_track_route(): void
    {
        $order = Order::factory()->create([
            'user_id' => User::factory()->create()->id,
        ]);

        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        $response = $this->get(route('track.auth', $order->id));

        $response->assertRedirect(route('login'));
    }

    // ── GUEST ORDERS ──────────────────────────────────

    /** @test */
    public function guest_can_access_order_via_valid_token(): void
    {
        $token = Str::uuid()->toString();

        $order = Order::factory()->create([
            'user_id' => null,
            'tracking_token' => $token,
        ]);
        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        $response = $this->get(route('track.guest', $token));

        $response->assertStatus(200);
    }

    /** @test */
    public function guest_gets_404_on_invalid_token(): void
    {
        $fakeToken = Str::uuid()->toString();

        $response = $this->get(route('track.guest', $fakeToken));

        $response->assertStatus(404);
    }

    /** @test */
    public function auth_user_gets_redirected_from_guest_token_route(): void
    {
        $user = User::factory()->create();
        $token = Str::uuid()->toString();

        $order = Order::factory()->create([
            'user_id' => null,
            'tracking_token' => $token,
        ]);
        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        $response = $this->actingAs($user)
                         ->get(route('track.guest', $token));

        $response->assertStatus(302); // redirected to auth route
        $response->assertRedirect();
    }

    /** @test */
    public function guest_cannot_see_authenticated_users_order_via_guest_route(): void
    {
        $user = User::factory()->create();
        $token = Str::uuid()->toString();

        $order = Order::factory()->create([
            'user_id' => $user->id,   // belongs to auth user
            'tracking_token' => $token,
        ]);
        OrderAddress::factory()->create(['order_id' => $order->id]);
        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);

        // Because guest route only allows user_id = null
        $response = $this->get(route('track.guest', $token));

        $response->assertStatus(404); // 404 = guest cannot access auth order
    }

    // ── COUPON TESTS ────────────────────────────────

    /** @test */
    public function coupon_deactivates_after_reaching_max_uses(): void
    {
        $coupon = Coupon::factory()->create([
            'max_uses' => 1,
            'times_used' => 0,
            'is_active' => true,
        ]);

        $context = CheckoutContextFactory::make(user: null, coupon: $coupon);
        $this->orderService->checkoutCOD($context);

        $coupon->refresh();
        $this->assertEquals(1, $coupon->times_used);
        $this->assertFalse((bool) $coupon->is_active);
    }

    /** @test */
    public function only_one_user_can_use_last_coupon_slot(): void
    {
        $coupon = Coupon::factory()->create(['max_uses' => 1, 'times_used' => 0]);
        $context1 = CheckoutContextFactory::make(user: null, coupon: $coupon);
        $context2 = CheckoutContextFactory::make(user: null, coupon: $coupon);

        $this->orderService->checkoutCOD($context1);

        $this->expectException(CheckoutException::class);
        $this->orderService->checkoutCOD($context2);

        $this->assertEquals(1, Order::count());
        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    /** @test */
    public function coupon_deleted_between_checkout_and_save_rolls_back(): void
    {
        $coupon = Coupon::factory()->create();
        $context = CheckoutContextFactory::makeWithCouponId(user: null, couponId: $coupon->id);

        $coupon->delete();

        $this->expectException(CheckoutException::class);
        $this->orderService->checkoutCOD($context);

        $this->assertEquals(0, Order::count());
    }

    // ── GUEST TOKEN INTEGRITY ───────────────────────

    /** @test */
    public function each_guest_order_gets_unique_token(): void
    {
        $context1 = CheckoutContextFactory::make(user: null);
        $context2 = CheckoutContextFactory::make(user: null);

        $order1 = $this->orderService->checkoutCOD($context1);
        $order2 = $this->orderService->checkoutCOD($context2);

        $this->assertNotEquals($order1->tracking_token, $order2->tracking_token);
    }

    /** @test */
    public function guest_order_always_has_token(): void
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
    public function auth_order_never_has_token(): void
    {
        $user = User::factory()->create();
        $context = CheckoutContextFactory::make(user: $user);
        $order = $this->orderService->checkoutCOD($context);

        $this->assertNull($order->tracking_token);
    }
}