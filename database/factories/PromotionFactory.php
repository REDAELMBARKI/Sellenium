<?php

// ─────────────────────────────────────────────────────
// database/factories/PromotionFactory.php
// ─────────────────────────────────────────────────────
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PromotionFactory extends Factory
{
    public function definition(): array
    {
        $type  = $this->faker->randomElement(['percentage', 'fixed', 'free_shipping']);
        $value = match ($type) {
            'percentage'   => $this->faker->randomElement([5, 10, 15, 20, 25, 30, 50]),
            'fixed'        => $this->faker->randomElement([10, 20, 30, 50, 100]),
            'free_shipping'=> 0,
        };

        return [
            'name'                        => $this->faker->randomElement([
                'Summer Sale', 'Flash Deal', 'Bundle Deal', 'Clearance',
                'Winter Sale', 'Black Friday', 'Weekend Deal', 'Mega Sale',
                'New Arrivals', 'Seasonal Offer', 'Loyalty Reward',
            ]),
            'type'                        => $type,
            'value'                       => $value,
            'minimum_order_amount'        => $this->faker->optional(0.5)->randomElement([50, 100, 150, 200, 300]),
            'minimum_items'               => $this->faker->optional(0.3)->numberBetween(1, 5),
            'max_uses'                    => $this->faker->optional(0.6)->numberBetween(50, 1000),
            'times_used'                  => $this->faker->numberBetween(0, 100),
            'valid_from'                  => $this->faker->dateTimeBetween('-1 month', 'now'),
            'valid_until'                 => $this->faker->boolean(70)
                ? $this->faker->dateTimeBetween('now', '+6 months')
                : null,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'is_active'                   => $this->faker->boolean(80),
            'priority'                    => $this->faker->numberBetween(0, 10),
        ];
    }

    // State: active and not expired
    public function active(): static
    {
        return $this->state(fn() => [
            'is_active'   => true,
            'valid_from'  => now()->subDays(5),
            'valid_until' => now()->addMonths(3),
        ]);
    }

    // State: expired
    public function expired(): static
    {
        return $this->state(fn() => [
            'is_active'   => false,
            'valid_until' => now()->subDays(10),
        ]);
    }

    // State: percentage only
    public function percentage(): static
    {
        return $this->state(fn() => [
            'type'  => 'percentage',
            'value' => $this->faker->randomElement([10, 15, 20, 25, 30, 50]),
        ]);
    }

    // State: fixed amount only
    public function fixed(): static
    {
        return $this->state(fn() => [
            'type'  => 'fixed',
            'value' => $this->faker->randomElement([10, 20, 50, 100]),
        ]);
    }

    // State: free shipping
    public function freeShipping(): static
    {
        return $this->state(fn() => [
            'type'  => 'free_shipping',
            'value' => 0,
        ]);
    }

    // State: high priority (wins over others)
    public function highPriority(): static
    {
        return $this->state(fn() => [
            'priority' => $this->faker->numberBetween(8, 10),
        ]);
    }
}
