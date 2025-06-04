<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:20',
            'email' => 'required|string|max:50|email|unique:users',
            'password' => 'required|min:8|string',
            'role' => 'in:admin,user,gost'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' =>'user',
            'bio' => $request->bio
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Uspešno ste se registrovali.',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        // Validacija
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|max:50|email',
            'password' => 'required|string|min:8',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Pogrešan email ili lozinka',
                'errors' => $validator->errors()
            ], 422);
        }

        // Proveri da li korisnik postoji
        $user = User::where('email', $request->email)->first();

        // Provera password-a
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Neispravno korisničko ime ili lozinka.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }


    // Odjava korisnika
    public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();
    
        return response()->json(['message' => 'Uspešno ste se odjavili i vaš token je obrisan.']);
    }


}
