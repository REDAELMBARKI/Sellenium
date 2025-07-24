<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promotion>
 */
class PromotionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'promo_percentage' => $this->faker->randomFloat(2,0.0,0.85),
            'product_id' => Product::inRandomOrder()->first()->id,
            'dead_line' => $this->faker->dateTime()->format('Y-m-d H:i:s')
        ];
    }
}
