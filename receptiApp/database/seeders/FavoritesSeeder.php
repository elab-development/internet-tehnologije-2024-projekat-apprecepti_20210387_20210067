<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FavoritesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        $users->each(function ($user) {
            // Svaki korisnik dodaje 1-5 recepata u omiljene
            $user->favorites()->attach(
                Recipe::inRandomOrder()->limit(rand(1, 5))->pluck('id')->toArray()
            );
        });
    }
}
