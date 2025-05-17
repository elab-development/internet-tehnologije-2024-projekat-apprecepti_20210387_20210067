<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    //prima vise mogucih rola
    public function handle(Request $request, Closure $next, ...$roles): Response
    {

        //proveravamo da li je korisnik prijavljen i da li ima trazenu ulogu
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Nemate dozvolu'], 403);
        }
    
        return $next($request);
    }
}
