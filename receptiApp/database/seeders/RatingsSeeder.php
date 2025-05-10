<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RatingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        Recipe::all()->each(function ($recipe) use ($users) {
            // Svaki recept dobija od 1 do 5 ocena
            $recipe->ratedByUsers()->attach(
                $users->random(rand(1, 5))->pluck('id')->toArray(),
                ['ocena' => rand(1, 5)]
            );
        });
    }
}
