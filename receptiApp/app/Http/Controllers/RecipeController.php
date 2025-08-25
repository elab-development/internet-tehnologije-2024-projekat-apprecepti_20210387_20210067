<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecipeResource;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

//rad sa transakcijama
use Illuminate\Support\Facades\DB;

//index()	Dohvata sve recepte
//store()	Kreira novi recept
//show()	Dohvata pojedinačan recept
//update()	Ažurira recept
//destroy()	Briše recept

//popular()	Dohvata najpopularnije recepte
//filterByCategory()	Dohvata recepte po kategoriji
//filterByIngredient()	Dohvata recepte po sastojcima

//addToFavorites() Ubacivanje recepata u omiljene
//removeFromFavorites() Uklanjanje recepata iz omiljenih
//favoritesCount() Dohvatanje broja korisnika koji su oznacili recepte kao omiljene
//rateRecipe() Dodavanje(azuriranje) ocene receptu
//getRecipeRatings() Prikaz svih ocena nekog recepta
//getAverageRecipeRating() Prikaz prosecne ocene recepta



class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::with('author')->get();
        //paginacija
        return RecipeResource::collection(Recipe::paginate(12));
    }

    //bez paginacije
    public function getAllRecipes()
    {
        $recipes = Recipe::with('author')->get();
        return RecipeResource::collection($recipes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'required|string',
            'vreme_pripreme' => 'required|integer|min:1',
            'tezina' => 'required|in:Lako,Srednje,Teško',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'ingredients' => 'array',
            'ingredients.*.id' => 'nullable|exists:ingredients,id',
            'ingredients.*.naziv' => 'nullable|string|max:255',
            'ingredients.*.kolicina' => 'required|numeric|min:1',
            'ingredients.*.mera' => 'required|string|max:20'
        ]);

        $validatedData['autor_id'] = Auth::id();

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('recipes', 'public');
        }

        $recipe = Recipe::create($validatedData);

        if (!empty($request->categories)) {
            $recipe->categories()->attach($request->categories);
        }

        if (!empty($request->ingredients)) {
            foreach ($request->ingredients as $ingredient) {
                $ingredientId = $ingredient['id'] ?? null;
                $naziv = $ingredient['naziv'] ?? null;

                if ($ingredientId) {
                    $recipe->ingredients()->attach($ingredientId, [
                        'kolicina' => $ingredient['kolicina'],
                        'mera' => $ingredient['mera']
                    ]);
                } elseif ($naziv) {
                    $newIngredient = Ingredient::firstOrCreate(['naziv' => $naziv]);
                    $recipe->ingredients()->attach($newIngredient->id, [
                        'kolicina' => $ingredient['kolicina'],
                        'mera' => $ingredient['mera']
                    ]);
                }
            }
        }

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
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'ingredients' => 'array',
            'ingredients.*.id' => 'nullable|exists:ingredients,id',
            'ingredients.*.naziv' => 'nullable|string|max:255',
            'ingredients.*.kolicina' => 'required|numeric|min:1',
            'ingredients.*.mera' => 'required|string|max:20'
        ]);

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('recipes', 'public');
        }

        $recipe->update($validatedData);

        if (!empty($request->categories)) {
            $recipe->categories()->sync($request->categories);
        }

        $recipe->ingredients()->detach();

        if (!empty($request->ingredients)) {
            foreach ($request->ingredients as $ingredient) {
                $ingredientId = $ingredient['id'] ?? null;
                $naziv = $ingredient['naziv'] ?? null;

                if ($ingredientId) {
                    $recipe->ingredients()->attach($ingredientId, [
                        'kolicina' => $ingredient['kolicina'],
                        'mera' => $ingredient['mera']
                    ]);
                } elseif ($naziv) {
                    $newIngredient = Ingredient::firstOrCreate(['naziv' => $naziv]);
                    $recipe->ingredients()->attach($newIngredient->id, [
                        'kolicina' => $ingredient['kolicina'],
                        'mera' => $ingredient['mera']
                    ]);
                }
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


        // Povećavamo broj pregleda samo ako korisnik nije već pregledao recept u ovoj sesiji
        $sessionKey = 'viewed_recipe_' . $id;

        if (!session()->has($sessionKey)) {
            $recipe->increment('pregledi'); // Povećavamo broj pregleda
            session()->put($sessionKey, true); // Beležimo da je korisnik već pregledao recept
        }

        return new RecipeResource($recipe);
    }

   
    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $recipe = Recipe::findOrFail($id);

                // Brišemo povezane podatke
                $recipe->categories()->detach();
                $recipe->ingredients()->detach();
                $recipe->favorites()->detach(); // brišemo i favorite 
                $recipe->ratedByUsers()->detach(); // ocene u pivot tabeli

                // Na kraju brišemo recept
                $recipe->delete();
            });

            return response()->json(['message' => 'Recept je uspešno obrisan.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Greška pri brisanju recepta.'], 500);
        }
    }


    //Prikazuje najpopularnije recepte, njih 10(sortirane po pregledima)
    public function popular()
    {
        $recipes = Recipe::orderByDesc('pregledi')->take(4)->get();
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


    // Filtriranje recepta po sastojcima(moguce je uneti vise sastojaka)
    public function filterByIngredients(Request $request)
    {
        $ingredientIds = $request->input('ingredients');

        if (!$ingredientIds || !is_array($ingredientIds)) {
            return response()->json(['message' => 'Morate uneti listu sastojaka.'], 400);
        }

        // Filtriramo recepte koji sadrže SVE navedene sastojke

        // Ako postoji samo jedan sastojak
        if (count($ingredientIds) === 1) {
            $recipes = Recipe::whereHas('ingredients', function ($query) use ($ingredientIds) {
                $query->where('ingredient_id', $ingredientIds[0]);
            })->get();
        } else {
            // Filtriramo recepte koji sadrže SVE navedene sastojke
            $recipes = Recipe::whereHas('ingredients', function ($query) use ($ingredientIds) {
                $query->whereIn('ingredient_id', $ingredientIds);
            }, '=', count($ingredientIds))->get();
        }

        return RecipeResource::collection($recipes);
    }

    //Dodavanje recepta u omiljene
    public function addToFavorites($id)
    {
        $user = Auth::user();
        $recipe = Recipe::findOrFail($id);

        if (!$user->favorites()->where('recipe_id', $id)->exists()) {
            $user->favorites()->attach($id);
            return response()->json(['message' => 'Recept dodat u omiljene.']);
        }

        return response()->json(['message' => 'Recept je već u omiljenima.'], 400);
    }

    //Uklanjanje recepta iz omiljenih
    public function removeFromFavorites($id)
    {
        $user = Auth::user();
        $recipe = Recipe::findOrFail($id);

        if ($user->favorites()->where('recipe_id', $id)->exists()) {
            $user->favorites()->detach($id);
            return response()->json(['message' => 'Recept uklonjen iz omiljenih.']);
        }

        return response()->json(['message' => 'Recept nije bio u omiljenima.'], 400);
    }

    //Prikaz broja korisnika koji su oznacili recept kao omiljen
    public function favoritesCount($id)
    {
        $recipe = Recipe::findOrFail($id);
        $count = $recipe->favorites()->count();

        return response()->json(['favorites_count' => $count]);
    }

    //Davanje/azuriranje ocene receptu
    public function rateRecipe(Request $request, $id)
    {
        $user = Auth::user();
        $recipe = Recipe::findOrFail($id);

        $validatedData = $request->validate([
            'ocena' => 'required|integer|min:1|max:5'
        ]);

        $user->ratings()->syncWithoutDetaching([
            $id => ['ocena' => $validatedData['ocena']]
        ]);

        return response()->json(['message' => 'Ocena je uspešno dodata(ažurirana).']);
    }

    // Prikaz korisnika i njihovih ocena za odredjeni recept
    public function getRecipeRatings($id)
    {
        $recipe = Recipe::with(['ratedByUsers' => function ($query) {
            $query->select('users.id', 'users.name', 'ratings.ocena')
                ->orderByDesc('ratings.ocena');
        }])->findOrFail($id);

        return response()->json([
            'recipe' => $recipe->naziv,
            'ratings' => $recipe->ratedByUsers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'ocena' => $user->pivot->ocena, // Samo ocena iz pivot tabele
                ];
            }),
        ]);
    }

    // Izracunavanje prosecne ocene za recept
    public function getAverageRecipeRating($id)
    {
        $recipe = Recipe::findOrFail($id);
        $averageRating = $recipe->ratedByUsers()->avg('ratings.ocena');

        return response()->json(['average_rating' => round($averageRating, 1)]);
    }

    //filtriranje po kategorijama i sastojcima
    public function filterByCategoryAndIngredients(Request $request)
    {
        $categoryId = $request->query('category');
        $ingredientIds = $request->query('ingredients', []);
    
        if (!is_array($ingredientIds)) {
            $ingredientIds = [$ingredientIds];
        }
    
        try {
            $recipes = Recipe::whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                })
                ->where(function ($query) use ($ingredientIds) {
                    foreach ($ingredientIds as $ingredientId) {
                        $query->whereHas('ingredients', function ($q) use ($ingredientId) {
                            $q->where('ingredients.id', $ingredientId);
                        });
                    }
                })
                ->with(['categories', 'ingredients'])
                ->get();
    
            return RecipeResource::collection($recipes);
    
        } catch (\Throwable $e) {
            logger()->error('Greška u filtriranju: ' . $e->getMessage());
            return response()->json(['error' => 'Greška na serveru.'], 500);
        }
    }
    
    //proverava da li je korisnik vec smestio recept u omiljene
    public function isFavorited($id)
    {
        $recipe = Recipe::findOrFail($id);
        $isFavorited = false;

        if (!Auth::check()) {
            return response()->json(['is_favorited' => false]);
        }

        $user = Auth::user();
        $isFavorited = $recipe->favorites()->where('user_id', $user->id)->exists();

        return response()->json(['is_favorited' => $isFavorited]);
    }

    // funkcija koja vraca broj recepta kreiranih po mesecu(sluzi kasnije za vizualizaciju podataka)
    public function recipesPerMonth()
    {
        $recipesByMonth = Recipe::select(
                DB::raw("MONTH(created_at) as mesec"),
                DB::raw("COUNT(*) as broj"))
            ->groupBy(DB::raw("MONTH(created_at)"))
            ->orderBy(DB::raw("MONTH(created_at)"))
            ->get();

        return response()->json($recipesByMonth);
    }
    
    //pretrazivanje recepta po nazivu
    public function searchByName(Request $request)
    {
        $search = $request->input('query');

        $recipes = Recipe::with(['author', 'categories', 'ingredients'])
            ->where('naziv', 'like', '%' . $search . '%')
            ->get();

        return RecipeResource::collection($recipes);
    }

}
