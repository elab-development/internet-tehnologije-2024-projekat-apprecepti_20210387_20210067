<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Doručak', 'Ručak', 'Večera','Užina','Posna hrana','Kolači','Paste','Zdrava hrana', 'Brzi obroci'];

        foreach ($categories as $category) {
            Category::create(['naziv' => $category]);
        }
    }
}
