<?php

namespace Database\Factories;

use App\Models\Color;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
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
            'size_id' => Size::inRandomOrder()->first()->id,
            'Fit_id' => Fit::inRandomOrder()->first()->id,
            'color_id' => Color::inRandomOrder()->first()->id,
            'material_id' => Material::inRandomOrder()->first()->id,
            'quantity' => $this->faker->numberBetween(1,10)
        ];
    }
}
