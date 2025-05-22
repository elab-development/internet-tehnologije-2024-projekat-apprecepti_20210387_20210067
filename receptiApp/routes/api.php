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

    // Admin moze da vidi sve komentare iz baze(i brise po potrebi)
    Route::get('/comments-all', [CommentController::class, 'allComments']);

    // CSV eksport podataka za korisnike
    Route::get('/admin/export-users', [UserController::class, 'exportToCsv']);

    // Broj recepta mesecno
    Route::get('/recipes/statistics/monthly', [RecipeController::class, 'recipesPerMonth']);

    //Prikaz svih recepta bez paginacije
    Route::get('/admin/recipes', [RecipeController::class, 'getAllRecipes']);
});

// RUTE KOJIMA MOGU PRISTUPITI ULOGOVANI KORISNIK I ADMIN 
Route::middleware(['auth:sanctum', RoleMiddleware::class . ':user,admin'])->group(function () {

    // Korisnik i admin mogu dodavati, menjati komentare i brisati komentare
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    Route::delete('/recipes/{id}/comments', [CommentController::class, 'deleteAllCommentsForRecipe']);


    // Korisnik i admin mogu dodavati i ažurirati recepte
    Route::resource('/recipes', RecipeController::class)->except(['index', 'show']);

    //Korisnik i admin mogu da daju(azuriraju) ocene receptu
    Route::post('/recipes/{id}/rate', [RecipeController::class, 'rateRecipe']);

    //Korisnik i admin mogu da vide svoje recepte
    Route::get('/users/{id}/recipes', [UserController::class, 'userRecipes']);

    //Korisnik i admin mogu da vide, dodaju i uklanjaju recepte iz omiljenih, i da proveravaju da li je vec u omiljenim
    Route::post('recipes/{id}/favorite',[RecipeController::class,'addToFavorites']);
    Route::delete('recipes/{id}/favorite', [RecipeController::class, 'removeFromFavorites']);
    Route::get('/user/favorites', [UserController::class, 'userFavorites']);
    Route::get('/recipes/{id}/is-favorited', [RecipeController::class, 'isFavorited']);

});

// SVE ULOGE(ADMIN, KORISNIK, GOST) IMAJU PRISTUP OVIM RUTAMA
//Svi mogu videti sve sastojke i pretrazivati ih po imenu
Route::get('/ingredients', [IngredientController::class, 'index']);
Route::get('/ingredients/search', [IngredientController::class, 'search']);

Route::get('/categories', [CategoryController::class, 'index']);// Svi mogu da vide sve dostupne kategorije
Route::get('/recipes/{id}/comments', [CommentController::class, 'getCommentsForRecipe']);//Prikaz svih komentara recepta

Route::get('/recipes/{id}/rating', [RecipeController::class, 'getAverageRecipeRating']);//Prikaz prosecne ocene za recept
Route::get('/recipes/{id}/ratings', [RecipeController::class, 'getRecipeRatings']);//Prikaz svih ocena za odredjeni recept
Route::get('/recipes/{id}/favorites-count', [RecipeController::class, 'favoritesCount']);//Dohvatanje broja korisnika koji su oznacili recept kao omiljen

Route::get('/recipes/filter', [RecipeController::class, 'filterByCategoryAndIngredients']);//Filtriranje po kategorijama i sastojcima
Route::get('/categories/{id}/recipes', [CategoryController::class, 'getRecipesByCategory']);//Filtriranje recepta po kategorijama
Route::get('/recipes/popular', [RecipeController::class, 'popular']);//Prikaz recepta sa najvise pregeleda
Route::get('/recipes/category/{id}', [RecipeController::class, 'filterByCategory']);
Route::get('/recipes/filter-by-ingredients', [RecipeController::class, 'filterByIngredients']);//Parametre saljemo putem query-ja u body delu kako bi omogucili real-time i pretragu po VISE sastojka
Route::resource('/recipes', RecipeController::class)->only(['index', 'show']);


