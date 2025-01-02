<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class Utilisateur extends Model
{
    // Connexion à MongoDB
    protected $connection = 'mongodb';
    protected $collection = 'utilisateurs';

    // Attributs remplissables
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'adresse',
        'telephone',
        'fonction',
        'photo',
        'mot_de_passe', // Le mot de passe sera enregistré sous forme hachée
        'date_creation',
        'date_suppression',
        'date_modification',
        'departement',
        'cohorte',
        'matricule',
        'status', // Nouveau champ ajouté
        'card_id', // Nouveau champ pour l'ID de la carte RFID
    ];

    // Cast des dates
    protected $casts = [
        'date_creation' => 'datetime',
        'date_suppression' => 'datetime',
        'date_modification' => 'datetime',
    ];

    // Actions lors de la création, mise à jour et suppression
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->date_creation = Carbon::now();
            $model->status = 'actif'; // Définir "statut" sur "actif" par défaut
        });

        static::updating(function ($model) {
            $model->date_modification = Carbon::now();
        });

        static::deleting(function ($model) {
            $model->date_suppression = Carbon::now();
            $model->save();
        });
    }

    // Setter pour hacher automatiquement le mot de passe avant de l'enregistrer
    public function setMotDePasseAttribute($value)
    {
        // Hacher le mot de passe uniquement s'il n'est pas déjà haché
        $this->attributes['mot_de_passe'] = bcrypt($value);
    }

    // Setter pour la fonction (validation des valeurs possibles)
    public function setFonctionAttribute($value)
    {
        $validFunctions = ['apprenant', 'vigile', 'admin', 'employer'];
        if (!in_array($value, $validFunctions)) {
            throw new \InvalidArgumentException("Invalid function value.");
        }
        $this->attributes['fonction'] = $value;
    }

    public function checkTelephoneExists($telephone)
    {
        $exists = Utilisateur::where('telephone', $telephone)->exists();
        return response()->json(['exists' => $exists]);
    }
}
