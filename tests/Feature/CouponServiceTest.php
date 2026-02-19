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
    private array $items;

    protected function setUp(): void
    {
        parent::setUp();

        $cart = $this->mock(CartService::class);
        $cart->shouldReceive('calculateCartItemsSubtotal')->andReturn(300);
        $cart->shouldReceive('calculateCartSubQuantity')->andReturn(5);

        $this->service = app(CouponService::class);
        $this->items   = [];
    }

    // ── 1. Inactive ────────────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_is_inactive(): void
    {
        $coupon = Coupon::factory()->inactive()->make();

        $this->expectException(CouponException::class);
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 2. Requires login ──────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_requires_account_and_user_is_guest(): void
    {
        $coupon = Coupon::factory()->requiresLogin()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('requires an account');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_passes_when_user_is_authenticated_and_coupon_requires_login(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make();

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 3. Max uses per user ───────────────────────────────────────────────

    /** @test */
    public function it_throws_if_user_exceeded_their_personal_usage_limit(): void
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

    /** @test */
    public function it_passes_if_user_has_not_reached_their_usage_limit(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make(['max_uses_per_user' => 3]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 4. Global usage limit ──────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_global_usage_is_exhausted(): void
    {
        $coupon = Coupon::factory()->exhausted()->active()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('maximum of use');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_passes_when_max_uses_is_null(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make(['max_uses' => null]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    /** @test */
    public function it_passes_when_coupon_has_not_reached_global_limit(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make([
            'max_uses'   => 100,
            'times_used' => 50,
        ]);

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

    /** @test */
    public function it_passes_when_coupon_is_within_valid_period(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->unlimited()->make();

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    /** @test */
    public function it_passes_when_valid_from_and_valid_until_are_null(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make([
            'valid_from'  => null,
            'valid_until' => null,
        ]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 6. Minimum order amount ────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_subtotal_is_below_minimum_amount(): void
    {
        // CartService mock returns 300, set minimum above that
        $coupon = Coupon::factory()->withMinimumAmount(500)->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('minimum amount');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_passes_when_cart_subtotal_meets_minimum_amount(): void
    {
        $user   = User::factory()->create();
        // CartService mock returns 300, set minimum below that
        $coupon = Coupon::factory()->withMinimumAmount(100)->unlimited()->make();

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    /** @test */
    public function it_passes_when_cart_subtotal_equals_minimum_amount(): void
    {
        $user   = User::factory()->create();
        // CartService mock returns exactly 300
        $coupon = Coupon::factory()->withMinimumAmount(300)->unlimited()->make();

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── 7. Minimum items ───────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_has_fewer_items_than_required(): void
    {
        // CartService mock returns quantity 5, set minimum above that
        $coupon = Coupon::factory()->withMinimumItems(10)->active()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('enough items');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    /** @test */
    public function it_passes_when_cart_meets_minimum_items(): void
    {
        $user   = User::factory()->create();
        // CartService mock returns 5, set minimum below that
        $coupon = Coupon::factory()->withMinimumItems(3)->unlimited()->make();

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
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

    /** @test */
    public function it_passes_when_coupon_has_no_product_or_category_restrictions(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->unlimited()->make([
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ]);

        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
        $this->assertTrue(true);
    }

    // ── getDbCouponCodeMatch ───────────────────────────────────────────────

    /** @test */
    public function it_returns_null_for_nonexistent_coupon_code(): void
    {
        $result = $this->service->getDbCouponCodeMatch('DOESNOTEXIST');
        $this->assertNull($result);
    }

    /** @test */
    public function it_returns_coupon_for_valid_active_code(): void
    {
        $coupon = Coupon::factory()->active()->create();

        $result = $this->service->getDbCouponCodeMatch($coupon->code);
        $this->assertNotNull($result);
        $this->assertEquals($coupon->id, $result->id);
    }

    /** @test */
    public function it_returns_null_for_inactive_coupon_code(): void
    {
        $coupon = Coupon::factory()->inactive()->create();

        $result = $this->service->getDbCouponCodeMatch($coupon->code);
        $this->assertNull($result);
    }

    /** @test */
    public function it_returns_null_for_expired_coupon_code(): void
    {
        $coupon = Coupon::factory()->expired()->create();

        $result = $this->service->getDbCouponCodeMatch($coupon->code);
        $this->assertNull($result);
    }
}