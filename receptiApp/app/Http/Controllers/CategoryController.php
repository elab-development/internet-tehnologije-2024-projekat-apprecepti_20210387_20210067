<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //prikaz svih kategorija
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    //dodavanje nove kategorije
    public function store(Request $request)
    {

        $validated = $request->validate([
            'naziv' => 'required|string|unique:categories,naziv|max:255',
        ]);

        $category = Category::create($validated);
        return new CategoryResource($category);
    }

    
    //Ažuriranje kategorije (samo admin)
    public function update(Request $request, $id)
    {

        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'naziv' => 'required|string|unique:categories,naziv,' . $id . '|max:255',
        ]);

        $category->update($validated);
        return new CategoryResource($category);
    }

    
    //Brisanje kategorije (samo admin) 
    public function destroy($id)
    {

        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Kategorija je obrisana!']);
    }

    
    //Dohvatanje recepata unutar određene kategorije
    //Laravel automatski zna da treba da pretraži pivot tabelu recipe_categories 
    //da bi pronašao sve recepte u određenoj kategoriji na osnovu onoga sto smo definisali u modelima
    public function getRecipesByCategory($id)
    {
        $category = Category::findOrFail($id);
        return response()->json([
            'kategorija' => $category->naziv,
            'recepti' => $category->recipes
        ]);
    }
}
