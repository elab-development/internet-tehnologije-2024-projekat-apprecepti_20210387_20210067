<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public static $wrap='comments';
    public function toArray(Request $request): array
    {
      
        return [
            'id' => $this->id,
            'autor' => new UserResource($this->whenLoaded('user')),
            'recept' => new RecipeResource($this->whenLoaded('recipe')),
            'sadrzaj' => $this->sadrzaj,
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}
