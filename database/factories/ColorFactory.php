<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Color>
 */
class ColorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public     $colorCodes = [
        'Black' => 'BLK',
        'White' => 'WHT',
        'Ivory' => 'IVR',
        'Cream' => 'CRM',
        'Beige' => 'BEIG',
        'Taupe' => 'TP',
        'Gray' => 'GRY',
        'Charcoal' => 'CHRC',
        'Silver' => 'SLV',
        'Stone' => 'STN',
        'Brown' => 'BRWN',
        'Cocoa' => 'CCO',
        'Mocha' => 'MCH',
    ];
    public $color = fake()->randomElement($this->colorCodes) ;
    public function definition(): array
    {
        return [
            "name"=> $this->color,
            "code"=> $this->colorCodes[$this->color] ?? strtoupper(substr($this->color,0,3)),
            
        ];
    }
}
