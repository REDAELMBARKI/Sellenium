<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cover>
 */
class CoverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {   
        $imgbase = $this->faker->numberBetween(1,15);
        return [
            "path"=> "/storage/covers/".$imgbase.'png',
            'product_id' => Product::inRandomOrder()->first()->id ?? Category::factory()->create()->id
        ];
    }
}
