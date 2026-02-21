<?php

namespace Tests\Unit\Services;


use App\Exceptions\ShippingException;
use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Services\ShippingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShippingServiceTest extends TestCase
{
    use RefreshDatabase;

    private ShippingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ShippingService::class);
    }

    // ═══════════════════════════════════════════════════════
    // Free shipping via promotion
    // ═══════════════════════════════════════════════════════

    public function test_returns_zero_when_free_shipping_promotion_active(): void
    {
        $promotion = Promotion::factory()->create([
            'type'      => 'free_shipping',
            'is_active' => true,
        ]);

        // no zone needed — promotion short-circuits before zone lookup
        $result = $this->service->calculateShipping(
            $this->makeItems(2, 100),
            'Casablanca',
            $promotion->id
        );

        $this->assertEquals(0.0, $result);
    }

    public function test_does_not_apply_free_shipping_for_non_free_shipping_promotion(): void
    {
        $promotion = Promotion::factory()->create([
            'type'      => 'percentage',
            'value'     => 20,
            'is_active' => true,
        ]);

        // zone must exist or it will throw ShippingException
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');

        $result = $this->service->calculateShipping(
            $this->makeItems(2, 100),
            'Casablanca',
            $promotion->id
        );

        $this->assertEquals(30.0, $result);
    }

    public function test_null_promotion_id_proceeds_normally(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');

        $result = $this->service->calculateShipping(
            $this->makeItems(2, 100),
            'Casablanca',
            null
        );

        $this->assertEquals(30.0, $result);
    }

    // ═══════════════════════════════════════════════════════
    // Zone validation
    // ═══════════════════════════════════════════════════════

    public function test_throws_when_city_has_no_shipping_zone(): void
    {
        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('not configured for this region');

        $this->service->calculateShipping($this->makeItems(1, 100), 'UnknownCity');
    }

    public function test_throws_when_zone_is_inactive(): void
    {
        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('currently unavailable');

        $this->makeZoneForCity('Casablanca', 30.0, 'fixed', active: false);

        $this->service->calculateShipping($this->makeItems(1, 100), 'Casablanca');
    }

    // ═══════════════════════════════════════════════════════
    // Zone pricing
    // ═══════════════════════════════════════════════════════

    public function test_returns_zero_when_zone_price_is_zero(): void
    {
        $this->makeZoneForCity('Casablanca', 0.0, 'fixed');

        $result = $this->service->calculateShipping($this->makeItems(2, 100), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    public function test_returns_fixed_zone_price(): void
    {
        $this->makeZoneForCity('Casablanca', 45.0, 'fixed');

        $result = $this->service->calculateShipping($this->makeItems(2, 100), 'Casablanca');

        $this->assertEquals(45.0, $result);
    }

    // ═══════════════════════════════════════════════════════
    // Free shipping thresholds
    // ═══════════════════════════════════════════════════════

    public function test_free_shipping_when_amount_threshold_met(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');
        $this->makeShippingSettings(threshold_amount: 300, type: 'amount');

        // 3 items × 100 = 300 — meets threshold
        $result = $this->service->calculateShipping($this->makeItems(3, 100), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    public function test_no_free_shipping_when_amount_below_threshold(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');
        $this->makeShippingSettings(threshold_amount: 500, type: 'amount');

        // 2 items × 100 = 200 — below threshold
        $result = $this->service->calculateShipping($this->makeItems(2, 100), 'Casablanca');

        $this->assertEquals(30.0, $result);
    }

    public function test_free_shipping_when_items_threshold_met(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');
        $this->makeShippingSettings(threshold_items: 3, type: 'items');

        // 3 items — meets threshold
        $result = $this->service->calculateShipping($this->makeItems(3, 100), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    public function test_free_shipping_both_type_requires_amount_and_items(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');
        $this->makeShippingSettings(threshold_amount: 300, threshold_items: 3, type: 'both');

        // meets amount (300) but not items (2 < 3) — should NOT be free
        $result = $this->service->calculateShipping($this->makeItems(2, 150), 'Casablanca');
        $this->assertEquals(30.0, $result);

        // meets both — should be free
        $result2 = $this->service->calculateShipping($this->makeItems(3, 100), 'Casablanca');
        $this->assertEquals(0.0, $result2);
    }

    public function test_free_shipping_either_type_requires_amount_or_items(): void
    {
        $this->makeZoneForCity('Casablanca', 30.0, 'fixed');
        $this->makeShippingSettings(threshold_amount: 500, threshold_items: 2, type: 'either');

        // only meets items (2 >= 2), not amount — should be free
        $result = $this->service->calculateShipping($this->makeItems(2, 100), 'Casablanca');
        $this->assertEquals(0.0, $result);
    }

    // ═══════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════

    private function makeZoneForCity(
        string $city,
        float $price,
        string $type,
        bool $active = true
    ): ShippingZone {
        $zone = ShippingZone::factory()->create([
            'price'     => $price,
            'type'      => $type,
            'is_active' => $active,
        ]);

        ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone->id,
        ]);

        return $zone;
    }

    private function makeShippingSettings(
        float $threshold_amount = 0,
        int $threshold_items = 0,
        string $type = 'amount'
    ): ShippingSetting {
        return ShippingSetting::factory()->create([
            'free_shipping_threshold_amount' => $threshold_amount,
            'free_shipping_threshold_items'  => $threshold_items,
            'free_shipping_type'             => $type,
            'base_weight_kg'                 => 5,
            'extra_kg_price'                 => 5,
        ]);
    }

    private function makeItems(int $count, float $unitSubtotal): array
    {
        return array_map(fn($i) => [
            'quantity' => 1,
            'subtotal' => $unitSubtotal,
            'product'  => ['id' => $i],
        ], range(1, $count));
    }
}