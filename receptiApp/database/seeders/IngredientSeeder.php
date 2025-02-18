<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = ['Brašno', 'Jaja', 'Mleko', 'Šećer', 'So', 'Piletina', 'Biber'];

        foreach ($ingredients as $ingredient) {
            Ingredient::create(['naziv' => $ingredient]);
        }   
    }
}
