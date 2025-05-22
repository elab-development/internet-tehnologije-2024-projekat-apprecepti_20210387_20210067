<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecipeResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\DB;

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
    
/**
 * @phpstan-ignore
 */
     
    public function userFavorites()
    {
        $user = Auth::user();

        // Proveravamo da li korisnik ima omiljene recepte
        if ($user->favorites()->count() == 0) {
            return response()->json(['message' => 'Nemate omiljene recepte', 'favorites' => []]);
        }

        // Dohvatamo omiljene recepte sa podacima o autoru
        $favorites = $user->favorites()->with('author')->get();

        return RecipeResource::collection($favorites);
    }

    //prikaz svih recepata nekog korisnika
    public function userRecipes($userId)
    {
        $user = User::with('recipes')->findOrFail($userId);
        return response()->json($user->recipes);
    }


    // export podataka o korisnicima
    public function exportToCsv()
    {
        $response = new StreamedResponse(function () {
            //Otvara „output stream“ za pisanje — spremno za direktni izlaz u browser
            $handle = fopen('php://output', 'w');
            //Piše prvi red – to su zaglavlja CSV fajla
            fputcsv($handle, ['ID', 'Name', 'Email', 'Broj recepata','Broj komentara', 'Poslednja aktivnost']);
            // Učitaj korisnike sa brojem recepata
            $users = User::withCount(['recipes', 'comments'])->get();
            foreach ($users as $user) {
                 // Poslednja aktivnost: uzimamo najnoviji timestamp iz recepata ili komentara
                $lastRecipe = $user->recipes()->latest('updated_at')->first();
                $lastComment = $user->comments()->latest('updated_at')->first();

                $lastActivity = max(
                    optional($lastRecipe)->updated_at,
                    optional($lastComment)->updated_at
                );
                //upisivanje reda u csv fajl
                fputcsv($handle, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->recipes_count,
                    $user->comments_count,
                    $lastActivity ? $lastActivity->toDateTimeString() : 'N/A',
                ]);
            }
            fclose($handle);
        });
        //Kaže browseru da šaljemo CSV fajl
        $response->headers->set('Content-Type', 'text/csv');
        //Browser zna da je to fajl koji treba preuzeti, i predlaže ime "users.csv"
        $response->headers->set('Content-Disposition', 'attachment; filename="users.csv"');
        return $response;
    }

    //Statistika registrovanih korisnika po mesecu
    public function usersPerMonth()
    {
        $users = DB::table('users')
            ->selectRaw('MONTH(created_at) as mesec, COUNT(*) as broj')
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        return response()->json($users);
    }



}
