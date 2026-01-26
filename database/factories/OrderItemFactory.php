<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        $product = Product::inRandomOrder()->first();

        return [
            'product_id' => $product->id,
            'order_id' => Order::inRandomOrder()->first()->id  ,
            'product_name' => $product->name, // snapshot
            'price' => $product->price,
            'quantity' => $this->faker->numberBetween(1, 3),
            'options' => $this->faker->boolean(60) ? [
                'color' => $this->faker->randomElement(['Black', 'White', 'Red']),
                'size' => $this->faker->randomElement(['S', 'M', 'L']),
            ] : null,
        ];
    }
}
