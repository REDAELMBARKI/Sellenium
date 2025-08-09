<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   
    public function definition(): array
    {
        return [
            'name' => $name = $this->faker->name,
            'brand' => $this->faker->name,
            
            'thumbnail' => $this->faker->url,
            'rating_count' => $this->faker->numberBetween(1,40),
            'rating_average' =>  $this->faker->numberBetween(1,5),
            'free_shipping' => $this->faker->boolean(),
            'description' => $this->faker->paragraph,
            'price'=> $this->faker->numberBetween(1,100),

            ];
    }
}
