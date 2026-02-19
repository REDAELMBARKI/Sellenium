<?php

namespace Tests\Feature;

use App\Exceptions\ShippingException;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Services\CartService;
use App\Services\ShippingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ShippingServiceTest extends TestCase
{
    use RefreshDatabase;

    private ShippingService $shippingService;

    protected function setUp(): void
    {
        parent::setUp();

        $cart = $this->mock(CartService::class);
        $cart->shouldReceive('calculateCartItemsSubtotal')->andReturn(300);
        $cart->shouldReceive('calculateCartSubQuantity')->andReturn(5);

        $this->shippingService = app(ShippingService::class);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private function makeItems(int $count = 1, float $weight = 1.0): array
    {
        $items = [];
        for ($i = 0; $i < $count; $i++) {
            $items[] = (object)[
                'quantity'        => 2,
                'product_variant' => (object)[
                    'product' => (object)[
                        'shipping' => (object)['weight' => $weight],
                    ],
                ],
            ];
        }
        return $items;
    }

    private function makeZoneWithCity(array $zoneAttributes = []): array
    {
        $zone = ShippingZone::factory()->create(array_merge([
            'is_active' => true,
            'price'     => 30.00,
            'type'      => 'fixed',
        ], $zoneAttributes));

        $city = ShippingZoneCity::factory()->create([
            'shipping_zone_id' => $zone->id,
        ]);

        // force fresh load from DB with eager loaded zone
        $city = ShippingZoneCity::with('zone')->find($city->id);

        return [$zone, $city];
    }

    private function makeSettings(array $attributes = []): ShippingSetting
    {
        return ShippingSetting::factory()->create(array_merge([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 500,
            'free_shipping_threshold_items'  => null,
            'base_weight_kg'                 => null,
            'extra_kg_price'                 => null,
        ], $attributes));
    }

    // ── 1. Zone not found ──────────────────────────────────────────────────

    #[Test]
    public function it_throws_if_city_has_no_zone(): void
    {
        $this->makeSettings();

        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('not configured');

        $this->shippingService->calculateShipping($this->makeItems(), 'CityThatDoesNotExist');
    }

    // ── 2. Zone inactive ───────────────────────────────────────────────────

    #[Test]
    public function it_throws_if_zone_is_inactive(): void
    {
        [, $city] = $this->makeZoneWithCity(['is_active' => false]);
        $this->makeSettings();

        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('unavailable');

        $this->shippingService->calculateShipping($this->makeItems(), $city->city);
    }

    // ── 3. Zone price is 0 ─────────────────────────────────────────────────

    #[Test]
    public function it_returns_zero_if_zone_price_is_zero(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 0]);
        $this->makeSettings();

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(0.0, $result);
    }

    // ── 4. Free shipping by amount ─────────────────────────────────────────

    #[Test]
    public function it_returns_zero_if_order_amount_meets_threshold(): void
    {
        // CartService mock returns 300 — threshold 200 is met
        [, $city] = $this->makeZoneWithCity();
        $this->makeSettings([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 200,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(0.0, $result);
    }

    #[Test]
    public function it_does_not_give_free_shipping_if_amount_below_threshold(): void
    {
        // CartService mock returns 300 — threshold 500 is NOT met
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'fixed']);
        $this->makeSettings([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 500,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(30.00, $result);
    }

    // ── 5. Free shipping by items ──────────────────────────────────────────

    #[Test]
    public function it_returns_zero_if_item_count_meets_threshold(): void
    {
        // CartService mock returns quantity 5 — threshold 3 is met
        [, $city] = $this->makeZoneWithCity();
        $this->makeSettings([
            'free_shipping_type'            => 'items',
            'free_shipping_threshold_items' => 3,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(0.0, $result);
    }

    #[Test]
    public function it_does_not_give_free_shipping_if_items_below_threshold(): void
    {
        // CartService mock returns quantity 5 — threshold 10 is NOT met
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'fixed']);
        $this->makeSettings([
            'free_shipping_type'            => 'items',
            'free_shipping_threshold_items' => 10,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(30.00, $result);
    }

    // ── 6. Free shipping by either ─────────────────────────────────────────

    #[Test]
    public function it_returns_zero_if_either_amount_or_items_met(): void
    {
        // amount met (300 >= 200), items NOT met (5 < 10) — either is enough
        [, $city] = $this->makeZoneWithCity();
        $this->makeSettings([
            'free_shipping_type'             => 'either',
            'free_shipping_threshold_amount' => 200,
            'free_shipping_threshold_items'  => 10,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(0.0, $result);
    }

    #[Test]
    public function it_does_not_give_free_shipping_if_neither_either_met(): void
    {
        // amount NOT met (300 < 500), items NOT met (5 < 10)
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'fixed']);
        $this->makeSettings([
            'free_shipping_type'             => 'either',
            'free_shipping_threshold_amount' => 500,
            'free_shipping_threshold_items'  => 10,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(30.00, $result);
    }

    // ── 7. Free shipping by both ───────────────────────────────────────────

    #[Test]
    public function it_returns_zero_only_if_both_amount_and_items_met(): void
    {
        // both met: amount 300 >= 200, items 5 >= 3
        [, $city] = $this->makeZoneWithCity();
        $this->makeSettings([
            'free_shipping_type'             => 'both',
            'free_shipping_threshold_amount' => 200,
            'free_shipping_threshold_items'  => 3,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(0.0, $result);
    }

    #[Test]
    public function it_does_not_give_free_shipping_if_only_one_of_both_met(): void
    {
        // amount met (300 >= 200) BUT items NOT met (5 < 10) — both required
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'fixed']);
        $this->makeSettings([
            'free_shipping_type'             => 'both',
            'free_shipping_threshold_amount' => 200,
            'free_shipping_threshold_items'  => 10,
        ]);

        $result = $this->shippingService->calculateShipping($this->makeItems(), $city->city);

        $this->assertEquals(30.00, $result);
    }

    // ── 8. Fixed zone price ────────────────────────────────────────────────

    #[Test]
    public function it_returns_fixed_zone_price_regardless_of_weight(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'fixed']);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 500,
        ]);

        // very heavy items — type is fixed so weight is ignored
        $result = $this->shippingService->calculateShipping(
            $this->makeItems(3, 50.0),
            $city->city
        );

        $this->assertEquals(30.00, $result);
    }

    // ── 9. Calculated — under base weight ─────────────────────────────────

    #[Test]
    public function it_returns_base_zone_price_if_weight_under_base(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'calculated']);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 500,
            'base_weight_kg'                 => 5.0,
            'extra_kg_price'                 => 10.0,
        ]);

        // total weight = 1.0kg × 2qty = 2kg — under 5kg base → just zone price
        $result = $this->shippingService->calculateShipping(
            $this->makeItems(1, 1.0),
            $city->city
        );

        $this->assertEquals(30.00, $result);
    }

    // ── 10. Calculated — over base weight ─────────────────────────────────

    #[Test]
    public function it_adds_extra_price_for_weight_over_base(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'calculated']);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 500,
            'base_weight_kg'                 => 2.0,
            'extra_kg_price'                 => 10.0,
        ]);

        // total weight = 3.0kg × 2qty = 6kg
        // extra = 6 - 2 = 4kg × 10 = 40 MAD
        // total = 30 + 40 = 70 MAD
        $result = $this->shippingService->calculateShipping(
            $this->makeItems(1, 3.0),
            $city->city
        );

        $this->assertEquals(70.00, $result);
    }

    // ── 11. Calculated — null weight ──────────────────────────────────────

    #[Test]
    public function it_treats_null_product_weight_as_zero(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'calculated']);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 500,
            'base_weight_kg'                 => 2.0,
            'extra_kg_price'                 => 10.0,
        ]);

        $items = [(object)[
            'quantity'        => 2,
            'product_variant' => (object)[
                'product' => (object)[
                    'shipping' => (object)['weight' => null],
                ],
            ],
        ]];

        // null weight → 0 → under base → just zone price
        $result = $this->shippingService->calculateShipping($items, $city->city);

        $this->assertEquals(30.00, $result);
    }

    // ── 12. Calculated — weight settings not configured ───────────────────

    #[Test]
    public function it_returns_zone_price_if_weight_settings_not_configured(): void
    {
        [, $city] = $this->makeZoneWithCity(['price' => 30.00, 'type' => 'calculated']);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 500,
            'base_weight_kg'                 => null,
            'extra_kg_price'                 => null,
        ]);

        // heavy items but no weight config — skip extra calc
        $result = $this->shippingService->calculateShipping(
            $this->makeItems(1, 10.0),
            $city->city
        );

        $this->assertEquals(30.00, $result);
    }

    #[Test]
public function debug_zone_lookup(): void
{
    $zone = ShippingZone::factory()->create([
        'is_active' => true,
        'price'     => 30.00,
        'type'      => 'fixed',
    ]);

    $city = ShippingZoneCity::factory()->create([
        'shipping_zone_id' => $zone->id,
    ]);

    // simulate exactly what service does
    $found = ShippingZoneCity::with('zone')->where('city', $city->city)->first();

    dump([
        'city_name'    => $city->city,
        'found_city'   => $found?->city,
        'found_zone'   => $found?->zone,
        'zone_id'      => $found?->shipping_zone_id,
    ]);

    $this->assertNotNull($found?->zone);
}
}