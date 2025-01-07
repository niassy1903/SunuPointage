<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken(); // Récupère le token dans l'en-tête Authorization

        if (!$token) {
            return response()->json(['message' => 'Token manquant'], 401);
        }

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            $request->attributes->add(['user' => (array) $decoded]); // Ajoute les données utilisateur à la requête
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token invalide ou expiré', 'error' => $e->getMessage()], 401);
        }

        return $next($request);
    }
}
