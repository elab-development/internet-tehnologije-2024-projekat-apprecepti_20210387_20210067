<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = ['naziv'];
    //jedna kategorija moze imati vise recepta
    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'recipe_categories');
    }
}
