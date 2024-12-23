<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Cohorte extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'cohortes';

    protected $fillable = [
        'nom',
        'annee_creation',
        'description',
    ];

    protected $casts = [
        'annee_creation' => 'datetime',
    ];
}

