<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Departement extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'departements';

    protected $fillable = [
        'nom',
        'annee_creation',
        'description',
    ];

    protected $casts = [
        'annee_creation' => 'datetime',
    ];
}
