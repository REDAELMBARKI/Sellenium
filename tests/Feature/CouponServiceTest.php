<?php

namespace Tests\Unit\Services;

use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use App\Services\CartService;
use App\Services\CouponService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponServiceTest extends TestCase
{
    use RefreshDatabase;

    private CouponService $service;
    private array $items = [];

    protected function setUp(): void
    {
        parent::setUp();

        $cart = $this->mock(CartService::class);
        $cart->shouldReceive('calculateCartItemsSubtotal')->andReturn(300);
        $cart->shouldReceive('calculateCartSubQuantity')->andReturn(5);

        $this->service = app(CouponService::class);
    }

    // ── 1. Inactive ────────────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_is_inactive(): void
    {
        $coupon = Coupon::factory()->inactive()->make();

        $this->expectException(CouponException::class);
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 2. requires account (check order: before per-user & global limit) ──

    /** @test */
    public function it_throws_if_guest_uses_coupon_with_per_user_limit(): void
    {
        $coupon = Coupon::factory()->make(['max_uses_per_user' => 1]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('requires an account');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_passes_if_authenticated_user_uses_coupon_with_per_user_limit(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make(['max_uses_per_user' => 3]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 3. Per user usage limit ────────────────────────────────────────────

    /** @test */
    public function it_throws_if_user_exceeded_personal_usage_limit(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->userExhausted(1)->create();

        Order::factory()->create([
            'user_id'   => $user->id,
            'coupon_id' => $coupon->id,
            'status'    => 'delivered',
        ]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('maximum number of uses');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    // ── 4. Global usage limit ──────────────────────────────────────────────

    /** @test */
    public function it_throws_if_global_usage_is_exhausted(): void
    {
        $user = User::factory()->create();
        // max_uses_per_user must be null to skip check 2 & 3 and reach check 4
        $coupon = Coupon::factory()->make([
            'is_active'          => true,
            'max_uses'           => 10,
            'times_used'         => 10,
            'max_uses_per_user'  => null,
        ]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('maximum of use');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    /** @test */
    public function it_passes_if_max_uses_is_null(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make(['max_uses' => null]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 5. Validity period ─────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_is_expired(): void
    {
        $coupon = Coupon::factory()->expired()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('not valid at this time');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_throws_if_coupon_is_not_yet_valid(): void
    {
        $coupon = Coupon::factory()->notYetValid()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('not valid at this time');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 6. Minimum order amount ────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_subtotal_is_below_minimum_amount(): void
    {
        // cart mock returns 300, minimum set above that
        $coupon = Coupon::factory()->withMinimumAmount(500)->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('minimum amount');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 7. Minimum items ───────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_has_fewer_items_than_required(): void
    {
        // cart mock returns quantity 5, minimum set above that
        $coupon = Coupon::factory()->withMinimumItems(10)->active()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('enough items');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 8. Product / category restrictions ────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_does_not_apply_to_cart_products(): void
    {
        $coupon = Coupon::factory()->active()->forProducts([999, 998])->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('does not apply');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── getDbCouponCodeMatch ───────────────────────────────────────────────

    /** @test */
    public function it_returns_coupon_for_valid_active_code(): void
    {
        $coupon = Coupon::factory()->active()->create();

        $result = $this->service->getDbCouponCodeMatch($coupon->code);

        $this->assertEquals($coupon->id, $result->id);
    }

    /** @test */
    public function it_returns_null_for_inactive_or_nonexistent_code(): void
    {
        $inactive = Coupon::factory()->inactive()->create();

        $this->assertNull($this->service->getDbCouponCodeMatch($inactive->code));
        $this->assertNull($this->service->getDbCouponCodeMatch('DOESNOTEXIST'));
    }
}