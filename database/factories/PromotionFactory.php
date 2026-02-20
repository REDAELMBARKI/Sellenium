<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PromotionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'                        => $this->faker->words(3, true),
            'type'                        => $this->faker->randomElement(['percentage', 'fixed', 'free_shipping']),
            'value'                       => $this->faker->randomFloat(2, 5, 50),
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'max_uses'                    => null,
            'times_used'                  => 0,
            'valid_from'                  => null,
            'valid_until'                 => null,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'is_active'                   => true,
            'priority'                    => 0,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function active(): static
    {
        return $this->state(['is_active' => true]);
    }

    public function percentage(): static
    {
        return $this->state(['type' => 'percentage', 'value' => 20]);
    }

    public function fixed(): static
    {
        return $this->state(['type' => 'fixed', 'value' => 50]);
    }

    public function freeShipping(): static
    {
        return $this->state(['type' => 'free_shipping', 'value' => 0]);
    }

    public function expired(): static
    {
        return $this->state([
            'valid_from'  => now()->subDays(10),
            'valid_until' => now()->subDay(),
        ]);
    }

    public function notYetValid(): static
    {
        return $this->state([
            'valid_from'  => now()->addDays(5),
            'valid_until' => now()->addDays(10),
        ]);
    }

    public function exhausted(): static
    {
        return $this->state([
            'max_uses'   => 10,
            'times_used' => 10,
        ]);
    }

    public function unlimited(): static
    {
        return $this->state([
            'max_uses'   => null,
            'times_used' => 0,
        ]);
    }

    public function withMinimumAmount(float $amount): static
    {
        return $this->state(['minimum_order_amount' => $amount]);
    }

    public function withMinimumItems(int $items): static
    {
        return $this->state(['minimum_items' => $items]);
    }

    public function forProducts(array $productIds): static
    {
        return $this->state(['applicable_product_ids' => $productIds]);
    }

    public function forCategories(array $categoryIds): static
    {
        return $this->state(['applicable_category_ids' => $categoryIds]);
    }

    public function withPriority(int $priority): static
    {
        return $this->state(['priority' => $priority]);
    }
}