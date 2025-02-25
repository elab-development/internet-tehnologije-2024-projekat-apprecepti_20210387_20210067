<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Recipe;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    //Omoguceno je kreiranje komantara za odredjeni recept,
    //prikaz komentara za odredjeni recept
    //brisanje komentara za odredjeni recept,
    //prikaz svih komentara odredjenog recepta,
    //brisanje svih komentara odredjenog recepta 
    //i azuriranje odredjenog komentara

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'sadrzaj' => 'required|string|max:500'
        ]);

        $comment = Comment::create([
            'recipe_id' => $request->recipe_id,
            //PRIVREMENO!!!!
            'user_id' => 1,
            'sadrzaj' => $request->sadrzaj
        ]);

        return new CommentResource($comment);
    }

    //izmena odredjenog komentara
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        //if (auth()->id() !== $comment->user_id)
        //PRIVREMENO!!!!!!
        if ($comment->user_id == 1) {
            return response()->json(['message' => 'Nemate dozvolu da izmenite ovaj komentar.'], 403);
        }

        $request->validate([
            'sadrzaj' => 'required|string|max:500'
        ]);

        $comment->update(['sadrzaj' => $request->sadrzaj]);

        return new CommentResource($comment);
    }

    //Brisanje pojedinacnog komentara
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        //if (auth()->id() !== $comment->user_id && auth()->user()->role !== 'admin') {

        if ($comment->user_id !== 1) {
            return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj komentar.'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Komentar obrisan!']);
    }

    //Brisanje svih komentara
    public function deleteAllCommentsForRecipe($recipeId)
    {
        $recipe = Recipe::findOrFail($recipeId);

        //if (auth()->user()->role !== 'admin' && auth()->id() !== $recipe->autor_id) {
        if ($recipe->user_id !== 1) {
            return response()->json(['message' => 'Nemate dozvolu da obrišete komentare ovog recepta.'], 403);
        }

        Comment::where('recipe_id', $recipeId)->delete();

        return response()->json(['message' => 'Svi komentari za recept su obrisani.']);
    }

    //Prikaz svih komentara za odredjeni recept
    public function getCommentsForRecipe($recipeId)
    {
        $comments = Comment::where('recipe_id', $recipeId)->with('user')->get();
        return CommentResource::collection($comments);
    }

}
