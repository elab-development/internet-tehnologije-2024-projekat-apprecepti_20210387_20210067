<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $wrap='recipes';
    
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'vreme_pripreme' => $this->vreme_pripreme . ' min',
            'tezina' => $this->tezina,
            'pregledi' => $this->pregledi,

            // Autor recepta
            'autor' => new UserResource($this->whenLoaded('author')),

            // Kategorije recepta
            'kategorije' => CategoryResource::collection($this->whenLoaded('categories')),

            // Sastojci sa kolicinom i merom iz pivot tabele `recipe_ingredients`
            'sastojci' => $this->ingredients->map(function ($ingredient) {
                return [
                    'id' => $ingredient->id,
                    'naziv' => $ingredient->naziv,
                    'kolicina' => $ingredient->pivot->kolicina,
                    'mera' => $ingredient->pivot->mera,
                ];
            }),

            // Ocenjivanje - prosečna ocena i ocene korisnika
            'prosecna_ocena' => round($this->ratedByUsers()->avg('ratings.ocena'), 1),
            'ocene_korisnika' => $this->ratedByUsers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'ime' => $user->name,
                    'ocena' => $user->pivot->ocena,
                    'datum_ocene' => $user->pivot->created_at->diffForHumans(),
                ];
            }),

            // Broj korisnika koji su dodali recept u omiljene
            'omiljeno_korisnicima' => $this->favorites()->count(),

            // Komentari
            'komentari' => CommentResource::collection($this->whenLoaded('comments')),

            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
