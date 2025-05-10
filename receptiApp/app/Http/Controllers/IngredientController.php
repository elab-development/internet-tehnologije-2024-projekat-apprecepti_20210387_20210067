<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    // Prikazuje sve sastojke
    public function index()
    {
        return response()->json(Ingredient::all());
    }


    // Dodaje novi sastojak (samo admin ili ako korisnik kreira recept)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255|unique:ingredients,naziv',
        ]);

        $ingredient = Ingredient::create($validatedData);

        return response()->json($ingredient, 201);
    }

    // Azurira sastojke(samo admin)
    public function update(Request $request, string $id)
    {

        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255|unique:ingredients,naziv,' . $id,
        ]);

        $ingredient = Ingredient::findOrFail($id);
        $ingredient->update($validatedData);

        return response()->json($ingredient);
    }

    // Brise sastojak(samo admin)
    public function destroy(string $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();

        return response()->json(['message' => 'Sastojak obrisan!']);
    }

    // Pretrazivanje sastojka po imenu
    public function search(Request $request)
    {
        $search = $request->input('query');

        if (!$search) {
            return response()->json(['message' => 'Morate uneti naziv sastojka za pretragu.'], 400);
        }

        $ingredients = Ingredient::where('naziv', 'LIKE', "%$search%")->get();

        return response()->json($ingredients);
    }

}
