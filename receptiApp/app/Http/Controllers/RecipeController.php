<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use Illuminate\Http\Request;

//index()	Dohvata sve recepte
//store()	Kreira novi recept
//show()	Dohvata pojedinačan recept
//update()	Ažurira recept
//destroy()	Briše recept
//popular()	Dohvata najpopularnije recepte
//filterByCategory()	Dohvata recepte po kategoriji
//filterByIngredient()	Dohvata recepte po sastojcima


class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::all();
        return RecipeResource::collection($recipes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'required|string',
            'vreme_pripreme' => 'required|integer|min:1',
            'tezina' => 'required|in:Lako,Srednje,Teško',
            'autor_id' => 'required|exists:users,id',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'ingredients' => 'array',
            'ingredients.*.id' => 'exists:ingredients,id',
            'ingredients.*.kolicina' => 'required|numeric|min:1',
            'ingredients.*.mera' => 'required|string|max:20'
        ]);

        // Kreiramo recept
        $recipe = Recipe::create($validatedData);

        // Povezujemo recept sa kategorijama
        if ($request->has('categories')) {
            $recipe->categories()->attach($request->input('categories'));
        }

        // Povezujemo recept sa sastojcima i unosimo količinu i meru u pivot tabelu
        if ($request->has('ingredients')) {
            foreach ($request->input('ingredients') as $ingredient) {
                $recipe->ingredients()->attach($ingredient['id'], [
                    'kolicina' => $ingredient['kolicina'],
                    'mera' => $ingredient['mera']
                ]);
            }
        }

        return new RecipeResource($recipe);
    }

    public function show($id)
    {
        $recipe = Recipe::with([
            'author',
            'categories',
            'ingredients' => function ($query) {
                $query->withPivot(['kolicina', 'mera']); // Uključujemo dodatne podatke iz pivot tabele
            },
            'comments'
        ])->findOrFail($id);
    
        return new RecipeResource($recipe);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
    
        $validatedData = $request->validate([
            'naziv' => 'sometimes|string|max:255',
            'opis' => 'sometimes|string',
            'vreme_pripreme' => 'sometimes|integer|min:1',
            'tezina' => 'sometimes|in:Lako,Srednje,Teško',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'ingredients' => 'array',
            'ingredients.*.id' => 'exists:ingredients,id',
            'ingredients.*.kolicina' => 'required|numeric|min:1',
            'ingredients.*.mera' => 'required|string|max:20'
        ]);
    
        $recipe->update($validatedData);
    
        // Ažuriranje kategorija i sastojaka u pivot tabelama
        if ($request->has('categories')) {
            $recipe->categories()->sync($request->input('categories'));
        }
    
        if ($request->has('ingredients')) {
            $recipe->ingredients()->detach(); // Prvo brišemo postojeće zapise
            foreach ($request->input('ingredients') as $ingredient) {
                $recipe->ingredients()->attach($ingredient['id'], [
                    'kolicina' => $ingredient['kolicina'],
                    'mera' => $ingredient['mera']
                ]);
            }
        }
    
        return new RecipeResource($recipe);
    }

    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
    
        // Brišemo povezane zapise iz pivot tabela pre nego što obrišemo recept
        $recipe->categories()->detach();
        $recipe->ingredients()->detach();
    
        $recipe->delete();
    
        return response()->json(['message' => 'Recept obrisan!']);
    }

    //Prikazuje najpopularnije recepte, njih 10(sortirane po pregledima)
    public function popular()
    {
        $recipes = Recipe::orderByDesc('pregledi')->take(10)->get();
        return RecipeResource::collection($recipes);
    }

    //prikazuje recepte filtrirane po kategorijama
    public function filterByCategory($categoryId)
    {
        $recipes = Recipe::whereHas('categories', function ($query) use ($categoryId) {
            $query->where('category_id', $categoryId);
        })->with(['categories', 'ingredients', 'author', 'comments'])->get();

        return RecipeResource::collection($recipes);
    }
    
    //prikazuje recepte filtrirane po sastojcima
    public function filterByIngredient($ingredientId)
    {
        $recipes = Recipe::whereHas('ingredients', function ($query) use ($ingredientId) {
            $query->where('ingredient_id', $ingredientId);
        })->with(['categories', 'ingredients', 'author', 'comments'])->get();

        return RecipeResource::collection($recipes);
    }

}
