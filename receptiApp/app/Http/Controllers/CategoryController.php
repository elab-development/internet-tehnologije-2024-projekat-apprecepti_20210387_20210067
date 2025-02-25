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
        //$this->authorize('admin-only'); // Osiguravamo da samo admin može dodati kategoriju

        $validated = $request->validate([
            'naziv' => 'required|string|unique:categories,naziv|max:255',
        ]);

        $category = Category::create($validated);
        return new CategoryResource($category);
    }

    
    //Ažuriranje kategorije (samo admin)
    public function update(Request $request, $id)
    {
        //$this->authorize('admin-only');

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
        //$this->authorize('admin-only');

        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Kategorija je obrisana!']);
    }

    
    //Dohvatanje recepata unutar određene kategorije
    public function getRecipesByCategory($id)
    {
        $category = Category::findOrFail($id);
        return response()->json([
            'kategorija' => $category->naziv,
            'recepti' => $category->recipes
        ]);
    }
}
