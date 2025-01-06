<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class PasswordReset extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'password_resets';

    protected $fillable = ['email', 'token'];

    // Pour désactiver les timestamps automatiques de MongoDB
    public $timestamps = false;

    // Cryptage du token pour la sécurité
    public function setTokenAttribute($value)
    {
        $this->attributes['token'] = Crypt::encryptString($value);
    }

    public function getTokenAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    // Ajouter d'autres méthodes si nécessaire pour valider ou interagir avec la collection
}
