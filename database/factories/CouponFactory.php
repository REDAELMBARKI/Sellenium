<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        $type = $this->faker->randomElement(['percentage', 'fixed']);
        $validFrom = $this->faker->optional()->dateTimeBetween('-1 month', 'now');

        return [
            'code'                    => strtoupper($this->faker->unique()->bothify('??##??##')),
            'description'             => $this->faker->optional()->sentence(),

            'type'                    => $type,
            'value'                   => $type === 'percentage'
                                            ? $this->faker->randomElement([5, 10, 15, 20, 25, 30, 50])
                                            : $this->faker->randomElement([10, 20, 50, 100, 150]),

            'minimum_order_amount'    => $this->faker->optional()->randomElement([50, 100, 150, 200, 300]),
            'minimum_items'           => $this->faker->optional()->randomElement([1, 2, 3, 5]),

            'max_uses'                => $this->faker->optional()->randomElement([10, 50, 100, 500]),
            'max_uses_per_user'       => $this->faker->randomElement([1, 2, 3]),
            'times_used'              => 0,

            'valid_from'              => $validFrom,
            'valid_until'             => $validFrom
                                            ? $this->faker->dateTimeBetween($validFrom, '+3 months')
                                            : null,

            'is_active'               => $this->faker->boolean(80), // 80% chance active

            'applicable_product_ids'  => null,
            'applicable_category_ids' => null,
        ];
    }

    // --- States ---

    public function percentage(): static
    {
        return $this->state(fn () => [
            'type'  => 'percentage',
            'value' => $this->faker->randomElement([10, 20, 30, 50]),
        ]);
    }

    public function fixed(): static
    {
        return $this->state(fn () => [
            'type'  => 'fixed',
            'value' => $this->faker->randomElement([20, 50, 100]),
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'is_active'   => true,
            'valid_from'  => now()->subDay(),
            'valid_until' => now()->addMonth(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'is_active'   => false,
            'valid_from'  => now()->subMonths(2),
            'valid_until' => now()->subDay(),
        ]);
    }

    public function exhausted(): static
    {
        return $this->state(function () {
            $max = $this->faker->randomElement([10, 50, 100]);
            return [
                'max_uses'   => $max,
                'times_used' => $max,
            ];
        });
    }

    public function forProducts(array $productIds): static
    {
        return $this->state(fn () => [
            'applicable_product_ids' => $productIds,
        ]);
    }

    public function forCategories(array $categoryIds): static
    {
        return $this->state(fn () => [
            'applicable_category_ids' => $categoryIds,
        ]);
    }
}