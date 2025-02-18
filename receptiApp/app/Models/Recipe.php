<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;

    protected $fillable = ['naziv', 'opis', 'vreme_pripreme', 'tezina', 'autor_id'];
    //recept ima jednog autora
    public function author()
    {
        return $this->belongsTo(User::class, 'autor_id');
    }
    //jedan recept moze imati vise kategorija(i jedna kategorija moze imati vise recepta)VISE-VISE
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'recipe_categories');
    }
    //jedan recept moze imati vise sastojaka
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('kolicina', 'mera');
    }
    //jedan recept moze imati vise komentara(komentar se odnosi na samo jedan recept)JEDAN-VISE
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    //recept moze imati vise ocena
    public function ratedByUsers()
    {
        return $this->belongsToMany(User::class, 'ratings')->withPivot('ocena')->withTimestamps();
    }
    //recept moze biti favorit vise korisnika
    public function favorites()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
    //recept ima prosecnu ocenu
    public function getAverageRatingAttribute()
    {
        return $this->ratedByUsers()->avg('ratings.ocena');
    }
}
