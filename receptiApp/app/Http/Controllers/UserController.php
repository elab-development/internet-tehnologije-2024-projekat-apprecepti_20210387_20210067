<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    //prikaz svik korisnika
    public function index()
    {
        $users = User::all();
        return UserResource::collection($users);
    }

    //cuvanje novog korisnika
    public function store(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'bio' => $request->bio,
        ]);

        return new UserResource($user);
    }

    //prikaz odredjenog korisnika
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    //azuriranje odredjenog korisnika
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email', 'bio']));
        return new UserResource($user);
    }

    //brisanje odredjenog korisnika
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Brišemo sve recepte koje je korisnik napisao(ovo smo osigurali i u migracijama 'cascade opcijom')
        $user->recipes()->delete();

        // Brišemo sve komentare korisnika(ovo smo isto osigurali u migracijama za kreiranje comments tabele)
        $user->comments()->delete();

        // Brišemo korisnika
        $user->delete();

        return response()->json(['message' => 'Korisnik, njegovi recepti i komentari su obrisani!']);
    }

    // Vraća recepte koje je korisnik dodao u omiljene
    public function userFavorites()
    {
        $user = Auth::user();

        // Proveravamo da li korisnik ima omiljene recepte
        if($user->favorites->count()==0){
            return response()->json(['message'=>'Nemate omiljene recepte', 'favorites'=>[] ]);
        }

        // Dohvatamo omiljene recepte sa podacima o autoru
        $favorites = $user->favorites->with('author')->get();

        return response()->json($favorites);
    }
}
