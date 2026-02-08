<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,
            'price' => $this->faker->numberBetween(0,0),
            'oldPrice' => $this->faker->numberBetween(0,1),
            'stock_quantity' => $this->faker->numberBetween(0,1),
             
        ];
    }
}
