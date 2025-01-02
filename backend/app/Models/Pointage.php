<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Carbon;

class Pointage extends Model
{
    // Connexion à MongoDB
    protected $connection = 'mongodb';
    protected $collection = 'pointage';

    // Attributs remplissables
    protected $fillable = [
        'carte_id',
        'nom',
        'prenom',
        'date_actuelle',
        'heure_arrivee',
        'heure_depart',
        'statut',
        'temps_travail',
    ];

    // Enum pour le statut
    const STATUT_ABSENT = 'absent';
    const STATUT_MALADE = 'malade';
    const STATUT_CONGE = 'conge';
    const STATUT_PRESENT = 'present';
    const STATUT_RETARD = 'retard';

    // Cast des dates
    protected $casts = [
        'date_actuelle' => 'date',
    ];

    // Définir les valeurs par défaut lors de la création
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->date_actuelle = Carbon::now()->toDateString(); // Date actuelle
            $model->statut = $model->statut ?? self::STATUT_ABSENT; // Statut par défaut
            $model->heure_depart = null; // Définir explicitement heure_depart comme null
            $model->temps_travail = null; // Calculé plus tard
        });

        // Calcul du temps de travail après l'arrivée et le départ
        static::saving(function ($model) {
            if ($model->heure_arrivee && $model->heure_depart) {
                $arrivee = Carbon::createFromFormat('H:i', $model->heure_arrivee);
                $depart = Carbon::createFromFormat('H:i', $model->heure_depart);
                $model->temps_travail = $depart->diffInMinutes($arrivee);
            }
        });
    }
}
