<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class PersonalAccessToken extends Model implements HasAbilities
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
    ];

    protected $casts = [
        'abilities' => 'json',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Relation avec le modèle utilisateur
    public function tokenable()
    {
        return $this->belongsTo(Model::class, 'tokenable_id', '_id'); // Remplacez "_id" si nécessaire
    }

    public function can($ability)
    {
        return in_array('*', $this->abilities) || in_array($ability, $this->abilities);
    }

    public function cant($ability)
    {
        return !$this->can($ability);
    }
}
