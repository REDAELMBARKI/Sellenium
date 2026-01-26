<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $price = $this->faker->randomFloat(2, 100, 5000);
        $hasOldPrice = $this->faker->boolean(40);

        return [
            'name' => $this->faker->name(),
            'brand' => $this->faker->randomElement([
                'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Xiaomi', 'Sony'
            ]),
            'description' => $this->faker->paragraphs(3, true),

            'price' => $price,
            'oldPrice' => $hasOldPrice
                ? $price + $this->faker->randomFloat(2, 50, 800)
                : null,

            'isFeatured' => $this->faker->boolean(20),
            'isFreeShipping' => $this->faker->boolean(30),

            'status' => $this->faker->randomElement(['draft', 'published']),
            'ready_to_publish' => $this->faker->boolean(60),
            'quality_score' => $this->faker->numberBetween(40, 100),

            // ratings
            'rating_average' => $this->faker->boolean(70)
                ? $this->faker->randomFloat(2, 3.5, 5)
                : null,
            'rating_count' => $this->faker->numberBetween(0, 500),

            // JSON columns
            'shipping' => [
                'weight' => $this->faker->randomFloat(2, 0.5, 10),
                'width'  => $this->faker->numberBetween(10, 100),
                'height' => $this->faker->numberBetween(5, 60),
                'depth'  => $this->faker->numberBetween(5, 60),
            ],

            'aggregated_attributes' => [
                'colors' => $this->faker->randomElements(
                    ['black', 'white', 'red', 'blue', 'silver'], rand(1, 3)
                ),
                'sizes' => $this->faker->randomElements(
                    ['S', 'M', 'L', 'XL'], rand(1, 3)
                ),
            ],

            'inventory' => [
                'stock' => $this->faker->numberBetween(0, 300),
                'low_stock_threshold' => 10,
            ],

            'vendor' => [
                'name' => $this->faker->company(),
                'email' => $this->faker->companyEmail(),
                'rating' => $this->faker->randomFloat(1, 3, 5),
            ],

            'meta' => [
                'seo_title' => $this->faker->sentence(6),
                'seo_description' => $this->faker->sentence(12),
            ],

            'madeCountry' => $this->faker->randomElement([
                'Morocco', 'China', 'USA', 'Germany', 'Vietnam'
            ]),

            'releaseDate' => $this->faker->date(),

            'category_niche_id' => null, // set manually in seeder if needed
        ];
    }

    /**
     * Published product state
     */
    public function published()
    {
        return $this->state(fn () => [
            'status' => 'published',
            'ready_to_publish' => true,
        ]);
    }

    /**
     * Draft product state
     */
    public function draft()
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'ready_to_publish' => false,
        ]);
    }
}
