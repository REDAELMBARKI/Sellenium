<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        $type      = $this->faker->randomElement(['percentage', 'fixed']);
        $validFrom = $this->faker->dateTimeBetween('-1 month', 'now');

        return [
            'code'                        => strtoupper($this->faker->unique()->bothify('??##??##')),
            'description'                 => $this->faker->optional()->sentence(),

            'type'                        => $type,
            'value'                       => $type === 'percentage'
                                                ? $this->faker->randomElement([5, 10, 15, 20, 25, 30, 50])
                                                : $this->faker->randomElement([10, 20, 50, 100, 150]),

            'minimum_order_amount'        => null,
            'minimum_items'               => null,

            'max_uses'                    => null,
            'max_uses_per_user'           => 1,   // never null — NOT NULL in DB
            'times_used'                  => 0,

            'valid_from'                  => $validFrom,
            'valid_until'                 => $this->faker->dateTimeBetween($validFrom, '+3 months'),

            'is_active'                   => true,

            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ];
    }

    // ── Type ───────────────────────────────────────────────────────────────

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

    // ── Status & Validity ──────────────────────────────────────────────────

    public function active(): static
    {
        return $this->state(fn () => [
            'is_active'   => true,
            'valid_from'  => now()->subDay(),
            'valid_until' => now()->addMonth(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active'   => false,
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

    public function notYetValid(): static
    {
        return $this->state(fn () => [
            'is_active'   => true,
            'valid_from'  => now()->addDays(5),
            'valid_until' => now()->addMonth(),
        ]);
    }

    // ── Usage Limits ───────────────────────────────────────────────────────

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

    public function requiresLogin(int $maxPerUser = 1): static
    {
        return $this->state(fn () => [
            'is_active'         => true,
            'valid_from'        => now()->subDay(),
            'valid_until'       => now()->addMonth(),
            'max_uses_per_user' => $maxPerUser,
        ]);
    }

    public function userExhausted(int $maxPerUser = 1): static
    {
        return $this->state(fn () => [
            'is_active'         => true,
            'valid_from'        => now()->subDay(),
            'valid_until'       => now()->addMonth(),
            'max_uses_per_user' => $maxPerUser,
        ]);
    }

    public function unlimited(): static
    {
        return $this->state(fn () => [
            'is_active'                   => true,
            'valid_from'                  => now()->subDay(),
            'valid_until'                 => now()->addMonth(),
            'max_uses'                    => null,
            'max_uses_per_user'           => 1,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'times_used'                  => 0,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ]);
    }

    // ── Minimum Requirements ───────────────────────────────────────────────

    public function withMinimumAmount(int $amount): static
    {
        return $this->state(fn () => [
            'is_active'            => true,
            'valid_from'           => now()->subDay(),
            'valid_until'          => now()->addMonth(),
            'minimum_order_amount' => $amount,
        ]);
    }

    public function withMinimumItems(int $count): static
    {
        return $this->state(fn () => [
            'is_active'     => true,
            'valid_from'    => now()->subDay(),
            'valid_until'   => now()->addMonth(),
            'minimum_items' => $count,
        ]);
    }

    // ── Restrictions ───────────────────────────────────────────────────────

    public function forProducts(array $productIds): static
    {
        return $this->state(fn () => [
            'applicable_product_ids'      => $productIds,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ]);
    }

    public function forCategories(array $categoryIds): static
    {
        return $this->state(fn () => [
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => $categoryIds,
            'applicable_sub_category_ids' => null,
        ]);
    }

    public function forSubCategories(array $subCategoryIds): static
    {
        return $this->state(fn () => [
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => $subCategoryIds,
        ]);
    }
}