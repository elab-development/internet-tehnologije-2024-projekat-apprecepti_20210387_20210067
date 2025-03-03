<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Rute za autentifikaciju
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// RUTE KOJIMA IMA PRISTUP SAMO ADMIN
Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {
    Route::resource('/users', UserController::class); // Admin upravlja korisnicima(CRUD operacije)
    
    Route::resource('/categories', CategoryController::class)->except(['index']); // Admin upravlja kategorijama(kreiranje, azuriranje, brisanje)

    // Admin moze upravljati sastojcima
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{id}', [IngredientController::class, 'destroy']);
});

// RUTE KOJIMA MOGU PRISTUPITI ULOGOVANI KORISNIK I ADMIN 
Route::middleware(['auth:sanctum', RoleMiddleware::class . ':user,admin'])->group(function () {
    // Admin i korisnik mogu da vide sve dostupne kategorije
    Route::get('/categories', [CategoryController::class, 'index']);

    // Korisnik i admin mogu dodavati, menjati komentare i brisati komentare
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    Route::delete('/recipes/{id}/comments', [CommentController::class, 'deleteAllCommentsForRecipe']);

    //Korisnik i admin mogu videti sve sastojke i pretrazivati ih po imenu
    Route::get('/ingredients', [IngredientController::class, 'index']);
    Route::get('/ingredients/search', [IngredientController::class, 'search']);

    // Korisnik i admin mogu dodavati i ažurirati recepte
    Route::resource('/recipes', RecipeController::class)->except(['index', 'show']);
});

// SVE ULOGE(ADMIN, KORISNIK, GOST) IMAJU PRISTUP OVIM RUTAMA
Route::get('/recipes/{id}/comments', [CommentController::class, 'getCommentsForRecipe']);
Route::get('/categories/{id}/recipes', [CategoryController::class, 'getRecipesByCategory']);
Route::get('/recipes/popular', [RecipeController::class, 'popular']);
Route::get('/recipes/category/{id}', [RecipeController::class, 'filterByCategory']);
Route::get('/recipes/filter-by-ingredients', [RecipeController::class, 'filterByIngredients']);//Parametre saljemo putem query-ja u body delu kako bi omogucili real-time i pretragu po VISE sastojka
Route::resource('/recipes', RecipeController::class)->only(['index', 'show']);
