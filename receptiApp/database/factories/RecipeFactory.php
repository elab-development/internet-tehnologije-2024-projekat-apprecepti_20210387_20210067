<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'naziv' => $this->faker->sentence(3),
            'opis' => $this->faker->paragraph(),
            'vreme_pripreme' => $this->faker->numberBetween(10, 120),
            'tezina' => $this->faker->randomElement(['Lako', 'Srednje', 'Teško']),
            'autor_id' => \App\Models\User::factory(),
        ];
    }
}
