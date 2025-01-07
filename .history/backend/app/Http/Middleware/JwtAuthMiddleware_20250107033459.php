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
        $authHeader = $request->header('Authorization');
        if (!$authHeader) {
            return response()->json(['message' => 'Token manquant'], 401);
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            $request->attributes->add(['user' => $decoded]); // Ajouter l'utilisateur à la requête si nécessaire
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token invalide'], 401);
        }

        return $next($request);
    }
}
