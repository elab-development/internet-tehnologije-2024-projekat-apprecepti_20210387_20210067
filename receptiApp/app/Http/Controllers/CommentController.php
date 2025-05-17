<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            'user_id' => Auth::id(),
            'sadrzaj' => $request->sadrzaj
        ]);

        return new CommentResource($comment);
    }

    //izmena odredjenog komentara
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if (Auth::id() !== $comment->user_id) {
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
        $comment = Comment::with('recipe')->findOrFail($id);
    
        $isCommentOwner = Auth::id() === $comment->user_id;
        $isRecipeOwner = optional($comment->recipe)->user_id === Auth::id();
        $isAdmin = Auth::user()->role === 'admin';
    
        if (!$isCommentOwner && !$isRecipeOwner && !$isAdmin) {
            return response()->json(['message' => 'Nemate dozvolu'], 403);
        }
    
        $comment->delete();
    
        return response()->json(['message' => 'Komentar obrisan!']);
    }
    

    //Brisanje svih komentara
    public function deleteAllCommentsForRecipe($recipeId)
    {
        $recipe = Recipe::findOrFail($recipeId);

        // Samo korisnik koji je kreirao recept i admin mogu da obisu sve komentare za taj recept
        if (Auth::user()->role !== 'admin' && Auth::id() !== $recipe->autor_id) {
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

    //Vraca sve komentare iz baze za sve recepte
    public function allComments()
    {
        return response()->json(CommentResource::collection(Comment::with('user')->latest()->get()));
    }
}
