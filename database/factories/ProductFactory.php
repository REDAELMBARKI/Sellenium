<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
{
    $name = $this->faker->words(rand(2, 4), true);

    return [
        'name'              => ucwords($name),
        'slug'              => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 9999),
        'brand'             => $this->faker->randomElement([
                                'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Xiaomi', 'Sony', 'Nike', 'Adidas'
                               ]),
        'description'       => $this->faker->paragraphs(3, true),
        'madeCountry'       => $this->faker->randomElement(['Morocco', 'China', 'USA', 'Germany', 'Vietnam', 'Japan']),
        'releaseDate'       => $this->faker->date(),
        'badge_text'        => $this->faker->randomElement(['New', 'Hot', 'Sale', 'Limited', null]),
        'category_niche_id' => null,

        'isFeatured'            => $this->faker->boolean(20),
        'allow_backorder'       => $this->faker->boolean(20),
        'show_countdown'        => $this->faker->boolean(50),
        'show_reviews'          => true,
        'show_related_products' => true,
        'show_social_share'     => true,

        'status'            => $this->faker->randomElement(['draft', 'published']),
        'ready_to_publish'  => $this->faker->boolean(60),
        'quality_score'     => $this->faker->numberBetween(40, 100),

        'rating_average'    => $this->faker->boolean(70)
                                ? $this->faker->randomFloat(2, 3.5, 5)
                                : null,
        'rating_count'      => $this->faker->numberBetween(0, 500),

        'inventory'         => [
            'backorderOptions'  => $this->faker->randomElement(['deny', 'notify', 'allow']),
            'trackInventory'    => $this->faker->boolean(80),
            'lowStockThreshold' => $this->faker->numberBetween(1, 20),
            'stockStatus'       => $this->faker->randomElement(['in_stock', 'out_of_stock', 'discontinued']),
            'weight'            => $this->faker->randomFloat(2, 0.1, 20),
            'weightUnit'        => $this->faker->randomElement(['kg', 'g', 'lb', 'oz']),
            'dimensions'        => [
                'length' => $this->faker->randomFloat(1, 5, 100),
                'width'  => $this->faker->randomFloat(1, 5, 100),
                'height' => $this->faker->randomFloat(1, 2, 60),
                'unit'   => $this->faker->randomElement(['cm', 'in', 'mm']),
            ],
            'warehouseLocation' => 'Zone-' . $this->faker->randomElement(['A', 'B', 'C']) . '-' . $this->faker->numberBetween(1, 50),
            'fulfillmentType'   => $this->faker->randomElement(['', 'dropship', 'third_party']),
        ],

        'shipping'          => [
            'shippingClass'         => $this->faker->randomElement(['', 'express', 'pickup']),
            'handlingTime'          => $this->faker->numberBetween(1, 7),
            'shippingCostOverride'  => $this->faker->boolean(30)
                                        ? $this->faker->randomFloat(2, 2, 30)
                                        : null,
            'isReturnable'          => $this->faker->boolean(70),
            'returnWindow'          => $this->faker->numberBetween(7, 30),
            'returnPolicy'          => $this->faker->randomElement(['free_return', 'customer_pays']),
        ],

        'meta'              => [
            'metaTitle'       => $this->faker->sentence(6),
            'metaDescription' => $this->faker->sentence(15),
        ],

        'vendor'            => [
            'vendorName'  => $this->faker->company(),
            'vendorSku'   => strtoupper(Str::random(3)) . '-' . $this->faker->numberBetween(1000, 9999),
            'vendorNotes' => $this->faker->boolean(40) ? $this->faker->sentence() : null,
        ],

        'faqs'              => collect(range(1, rand(0, 3)))->map(fn() => [
            'question' => $this->faker->sentence() . '?',
            'answer'   => $this->faker->paragraph(),
        ])->toArray(),

        'related_product_ids'   => [],

        'aggregated_attributes' => [
            'colors' => $this->faker->randomElements(
                            ['black', 'white', 'red', 'blue', 'silver', 'gold'], rand(1, 3)
                         ),
            'sizes'  => $this->faker->randomElements(
                            ['XS', 'S', 'M', 'L', 'XL', 'XXL'], rand(1, 4)
                         ),
        ],
    ];
}

    // ── States ────────────────────────────────────────────────────────────
    public function draft(): static
    {
        return $this->state(['status' => 'draft', 'ready_to_publish' => false]);
    }

    public function published(): static
    {
        return $this->state(['status' => 'published', 'ready_to_publish' => true]);
    }

    public function featured(): static
    {
        return $this->state(['isFeatured' => true]);
    }
}