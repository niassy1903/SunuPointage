<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Firebase\JWT\JWT;
use Firebase\JWT\Key; // Utilisez ce namespace pour Firebase JWT

class Utilisateur extends Authenticatable implements CanResetPassword
{
    use Notifiable, CanResetPasswordTrait;

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
        'mot_de_passe',
        'date_creation',
        'date_suppression',
        'date_modification',
        'departement',
        'cohorte',
        'matricule',
        'status',
        'card_id',
    ];

    // Cast des dates
    protected $casts = [
        'date_creation' => 'datetime',
        'date_suppression' => 'datetime',
        'date_modification' => 'datetime',
    ];

    // Méthode nécessaire pour la réinitialisation du mot de passe
    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

    // Actions lors de la création, mise à jour et suppression
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->date_creation = Carbon::now();
            $model->status = 'actif'; 
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
        $this->attributes['mot_de_passe'] = bcrypt($value);
    }

    // Setter pour la fonction
    public function setFonctionAttribute($value)
    {
        $validFunctions = ['apprenant', 'vigile', 'admin', 'employer'];
        if (!in_array($value, $validFunctions)) {
            throw new \InvalidArgumentException("Invalid function value.");
        }
        $this->attributes['fonction'] = $value;
    }

    // Vérifie si le numéro de téléphone existe déjà
    public function checkTelephoneExists($telephone)
    {
        $exists = Utilisateur::where('telephone', $telephone)->exists();
        return response()->json(['exists' => $exists]);
    }

    // Relation avec HistoricPointage
    public function historicPointages()
    {
        return $this->hasMany(HistoricPointage::class, 'utilisateur_id');
    }

    // Génération du JWT pour l'utilisateur
    public function generateJWT()
    {
        $key = env('JWT_SECRET');  // Assurez-vous d'avoir une clé secrète définie dans votre .env
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // 1 heure
        $payload = [
            'iss' => "laravel-jwt",  // L'émetteur du token
            'sub' => $this->id,  // L'utilisateur identifié par l'ID
            'iat' => $issuedAt,  // Heure d'émission
            'exp' => $expirationTime,  // Expiration du token
        ];

        // Génération du token
        return JWT::encode($payload, $key, 'HS256');
    }

    // Vérification de l'authenticité du token
    public static function validateJWT($token)
    {
        try {
            $key = env('JWT_SECRET');  // Assurez-vous d'avoir une clé secrète définie dans votre .env
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return (array) $decoded;  // Retourne les données décodées
        } catch (\Exception $e) {
            return null;  // Token invalide ou expiré
        }
    }
}
