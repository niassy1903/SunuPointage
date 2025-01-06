<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoricPointage extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'historic_pointages';

    protected $fillable = [
        'utilisateur_id',
        'action',
        'detail',
        'created_at',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}
