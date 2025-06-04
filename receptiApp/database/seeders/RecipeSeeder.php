<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Prvo napravi sve recepte
        $recipes = Recipe::factory(20)->create();
        //Povezivanje sa kategorijama i sastojcima
        foreach ($recipes as $recipe) {
            $recipe->categories()->attach(
                Category::inRandomOrder()->limit(rand(1, 3))->pluck('id')->toArray()
            );

            $recipe->ingredients()->attach(
                Ingredient::inRandomOrder()->limit(rand(3, 6))->get()->mapWithKeys(function ($ingredient) {
                    return [$ingredient->id => ['kolicina' => rand(50, 500), 'mera' => 'g']];
                })->toArray()
            );
        }
    }
}
