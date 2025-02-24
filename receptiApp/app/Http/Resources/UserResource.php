<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,

            // Lista omiljenih recepata korisnika
            'omiljeni_recepti' => $this->favorites->map(function ($recipe) {
                return [
                    'id' => $recipe->id,
                    'naziv' => $recipe->naziv,
                    'pregledi' => $recipe->pregledi,
                    'ocena' => round($recipe->ratedByUsers()->avg('ratings.ocena'), 1),
                    'dodato_u_omiljene' => $recipe->pivot->created_at->diffForHumans(),
                ];
            }),

            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
