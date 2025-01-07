<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CohorteController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\HistoricPointageController;

// Route accessible par un utilisateur authentifié
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Réinitialisation du mot de passe
Route::post('password/forgot', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword']);

// Route pour récupérer un utilisateur par cardId
Route::get('/utilisateurs/card/{cardId}', [UtilisateurController::class, 'getUtilisateurByCardId']);

// Routes publiques pour la connexion
Route::post('login', [UtilisateurController::class, 'login']);
Route::post('login-by-card', [UtilisateurController::class, 'loginByCardId']);

// Vérifier si une carte existe
Route::get('check-card-id/{cardId}', [UtilisateurController::class, 'checkCardIdExists']);

// Routes pour la gestion des pointages (accès sécurisé)
Route::middleware('auth:sanctum')->group(function () {

    // Routes pour la gestion des utilisateurs
    Route::apiResource('utilisateurs', UtilisateurController::class);
    Route::get('employers/{departement}', [UtilisateurController::class, 'getEmployersByDepartment']);
    Route::get('/utilisateurs/apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getApprenantsByCohorte']);
    Route::get('/utilisateurs/liste-apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getListeApprenantsByCohorte']);
    Route::post('/assign-card', [UtilisateurController::class, 'assignCard']);
    Route::patch('/utilisateurs/{id}/bloquer', [UtilisateurController::class, 'bloquer']);
    Route::get('/telephones/{telephone}', [UtilisateurController::class, 'checkTelephoneExists']);

    // Routes pour la gestion des pointages
    Route::get('/pointages', [PointageController::class, 'index']);
    Route::get('/pointages/{id}', [PointageController::class, 'show']);
    Route::post('/pointages', [PointageController::class, 'store']);
    Route::put('/pointages/{id}', [PointageController::class, 'update']);
    Route::get('/pointage/{cardId}', [PointageController::class, 'getPointageByCardId']);
    Route::get('/pointages/totals/{date}', [PointageController::class, 'getTotalPointages']);
    Route::get('/pointages/validations/{date}', [PointageController::class, 'getTotalValidations']);
    Route::get('/pointages/rejets/{date}', [PointageController::class, 'getTotalRejets']);
    Route::get('/pointages/statistiques/{date}', [PointageController::class, 'getStatistiquesPointages']);
    
    // Routes pour la gestion des historiques de pointage
    Route::prefix('historic-pointages')->group(function () {
        Route::get('/', [HistoricPointageController::class, 'index']); // Lister tous les historiques
        Route::post('/', [HistoricPointageController::class, 'store']); // Créer un historique
        Route::get('/{id}', [HistoricPointageController::class, 'show']); // Voir un historique spécifique
        Route::put('/{id}', [HistoricPointageController::class, 'update']); // Mettre à jour un historique
        Route::delete('/{id}', [HistoricPointageController::class, 'destroy']); // Supprimer un historique
    });

    // Routes pour la gestion des départements et cohortes
    Route::apiResource('departements', DepartementController::class);
    Route::apiResource('cohortes', CohorteController::class);

    // Création d'un pointage
    Route::post('/create-pointage', [PointageController::class, 'createPointage']);
});

// Routes publiques (sans authentification)
Route::get('/utilisateurs', [UtilisateurController::class, 'index']);  // Lister tous les utilisateurs

Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show']);
