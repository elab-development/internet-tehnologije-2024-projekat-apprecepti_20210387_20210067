<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    //polja koja se mogu menjati(tj. mogu im se masovno dodeljivati vrednosti)
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //korisnik moze imati(uneti) vise recepta
    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'autor_id');
    }
    //korisnik moze imati vise komentara
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    //definisaje mnogostruke veze koriscenjem belongsToMany relacije i pivot tabele 
    
    //korisnik moze imati vise recepta favorita i jedan recept moze biti favorit vise kosrisnika
    public function favorites()
    {
        return $this->belongsToMany(Recipe::class, 'favorites')->withTimestamps();
    }

    public function ratings()
    {
        return $this->belongsToMany(Recipe::class, 'ratings')->withPivot('ocena')->withTimestamps();
    }
}
