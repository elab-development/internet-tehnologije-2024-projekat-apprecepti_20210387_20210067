<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //pozivamo sve seeder-e

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            IngredientSeeder::class,
            RecipeSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
