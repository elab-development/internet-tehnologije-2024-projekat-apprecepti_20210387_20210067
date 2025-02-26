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
    public function handle(Request $request, Closure $next,$role): Response
    {

        //proveravamo da li je korisnik prijavljen i da li ima trazenu ulogu
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json(['message' => 'Nemate dozvolu'], 403);
        }
        return $next($request);
    }
}
