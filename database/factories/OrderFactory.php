<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    private $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
    public function definition(): array
    {
        return [
           'order_number' => $this->faker->numberBetween(1,10),
           'product_id' => $this->product->id,
           'user_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
           'address' => $this->faker->address(),
           'status' => $this->faker->randomElement(['pending','delivered','canceled']),
           'shipping_cost' => $shipping  =  $this->faker->randomFloat(1,10),
           'discount_amount' => $discount = $this->faker->randomFloat(1,10),
           'notes' => $this->faker->text(100),
           'total_amount' => $this->product->price + $shipping - $discount

        ];
    }
}
