<?php

namespace Tests\Unit\Services;

use App\DTOs\CreateOrderDTO;
use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use App\Services\CartService;
use App\Services\Discount\CouponService;
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

    // ── 1. Guest ───────────────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_user_is_guest(): void
    {
        $coupon = Coupon::factory()->active()->make();

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('requires an account');
        $this->service->checkIsValidCoupon($coupon, $this->items, null);
    }

    // ── 2. Per user usage limit ────────────────────────────────────────────

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

    // ── 3. Global usage limit ──────────────────────────────────────────────

    /** @test */
    public function it_throws_if_global_usage_is_exhausted(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->create([
            'is_active'         => true,
            'max_uses'          => 10,
            'times_used'        => 10,
            'max_uses_per_user' => 99, // high enough so user hasn't exceeded it
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

    // ── 4. Validity period ─────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_is_expired(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->expired()->make(['max_uses_per_user' => 99]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('not valid at this time');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    /** @test */
    public function it_throws_if_coupon_is_not_yet_valid(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->notYetValid()->make(['max_uses_per_user' => 99]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('not valid at this time');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    // ── 5. Minimum order amount ────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_subtotal_is_below_minimum_amount(): void
    {
        $user   = User::factory()->create();
        // cart mock returns 300, minimum set above that
        $coupon = Coupon::factory()->withMinimumAmount(500)->make(['max_uses_per_user' => 99]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('minimum amount');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    // ── 6. Minimum items ───────────────────────────────────────────────────

    /** @test */
    public function it_throws_if_cart_has_fewer_items_than_required(): void
    {
        $user   = User::factory()->create();
        // cart mock returns quantity 5, minimum set above that
        $coupon = Coupon::factory()->withMinimumItems(10)->active()->make(['max_uses_per_user' => 99]);

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('enough items');
        $this->service->checkIsValidCoupon($coupon, $this->items, $user);
    }

    // ── 7. Product / category restrictions ────────────────────────────────

    /** @test */
    public function it_throws_if_coupon_does_not_apply_to_cart_products(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->make([
            'max_uses_per_user'           => 99,
            'applicable_product_ids'      => [999, 998], // product 1 not in here
            'applicable_category_ids'     => [999, 998], // category 1 not in here
            'applicable_sub_category_ids' => [999, 998], // sub category 1 not in here
        ]);

        $items = [
            new \App\DTOs\OrderItemDTO(
                product_variant_id: 1,
                quantity:           2,
                price_snapshot:     100.0,
                subtotal:           200.0,
                product_name:       'Test Product',
                product_variant:    ['id' => 1],
                product:            [
                    'id'             => 1,
                    'sub_categories' => [['id' => 1]],
                    'nich_category'  => [['id' => 1]],
                ],
            )
        ];

        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('does not apply');
        $this->service->checkIsValidCoupon($coupon, $items, $user);
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