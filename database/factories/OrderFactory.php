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

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        return [
           'order_number' => $this->faker->numberBetween(1,10),
           'product_id' => $product->id,
           'user_id' => User::inRandomOrder()->first()->id,
           'address' => $this->faker->address(),
           'status' => $this->faker->randomElement(['pending','delivered','canceled']),
           'shipping_cost' => $shipping  =  $this->faker->randomFloat(2,1.0 , 10.0),
           'discount_amount' => $discount = $this->faker->randomFloat(2,1.0 , 10.0),
           'notes' => $this->faker->text(),
           'total_amount' => $product->price + $shipping - $discount

        ];
    }
}
