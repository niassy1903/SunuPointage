<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class HistoricPointage extends Model
{
    // Connexion à MongoDB
    protected $connection = 'mongodb';
    protected $collection = 'historic_pointages';

    // Attributs remplissables
    protected $fillable = [
        'utilisateur_id',
        'action',
        'detail',
        'created_at', // Automatiquement géré par Laravel
    ];

    // Casts pour les types
    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relations
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id', '_id');
    }
}
