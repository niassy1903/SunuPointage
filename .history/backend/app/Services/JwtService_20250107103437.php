<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Exception;

class JwtService
{
    /**
     * Génère un token JWT pour un utilisateur donné.
     *
     * @param  array  $payload
     * @return string
     */
    public function generateToken(array $payload)
    {
        $key = env('JWT_SECRET'); // Clé secrète provenant du fichier .env
        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Décode un token JWT.
     *
     * @param  string  $token
     * @return object|bool
     */
    public function decodeToken($token)
    {
        try {
            $key = env('JWT_SECRET'); // Clé secrète provenant du fichier .env
            // Supprimer le troisième paramètre avec l'algorithme
            return JWT::decode($token, $key);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Valide un token JWT.
     *
     * @param  string  $token
     * @return bool
     */
    public function validateToken($token)
    {
        try {
            $decoded = $this->decodeToken($token);
            return $decoded ? true : false;
        } catch (Exception $e) {
            return false;
        }
    }
}
