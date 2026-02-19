<?php

namespace Database\Factories;

use App\Models\Coupon;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use DateTime;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderFactory extends Factory
{
    protected $model = Order::class;
     use HasFactory;
    public function definition()
    {
        $tax = $this->faker->randomFloat(2, 0, 50);
        $shipping = $this->faker->randomFloat(2, 20, 80);
        $discount = $this->faker->boolean(30)
            ? $this->faker->randomFloat(2, 10, 100)
            : 0;

        return [

            'order_number' => $this->faker->word() . now()->format('YmdHisv'),
            'user_id' => User::factory()->create()->id,
            'coupon_id' => Coupon::factory()->create()->id,
            'status' => $this->faker->randomElement(['pending', 'delivered', 'canceled']),
            'tax' => $tax,
            'tracking_token' => null , 
            'currency' => 'MAD',
            'shipping_cost' => $shipping,
            'discount_amount' => $discount,
            'total_amount' => 0, // calculated later

            'notes' => $this->faker->boolean(40)
                ? $this->faker->sentence()
                : null,
        ];
    }
}
