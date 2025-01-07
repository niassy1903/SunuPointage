<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CohorteController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\HistoricPointageController;




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Réinitialized Password Controller with email
Route::post('password/forgot', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/utilisateurs/card/{cardId}', [UtilisateurController::class, 'getUtilisateurByCardId']);


// Route pour récupérer tous les pointages
Route::get('/pointages', [PointageController::class, 'index']);

// Route pour récupérer un pointage spécifique par ID
Route::get('/pointages/{id}', [PointageController::class, 'show']);

// Route pour créer un pointage
Route::post('/pointages', [PointageController::class, 'store']);

// Route pour mettre à jour un pointage
Route::put('/pointages/{id}', [PointageController::class, 'update']);

Route::get('/pointage/{cardId}', [PointageController::class, 'getPointageByCardId']);



// Récupérer le total des pointages par jour (avec une date spécifique)
Route::get('/pointages/totals/{date}', [PointageController::class, 'getTotalPointages']);

// Récupérer le total des pointages validés par jour (avec une date spécifique)
Route::get('/pointages/validations/{date}', [PointageController::class, 'getTotalValidations']);

// Récupérer le total des pointages rejetés par jour (avec une date spécifique)
Route::get('/pointages/rejets/{date}', [PointageController::class, 'getTotalRejets']);
// Récupérer les statistiques des pointages par statut pour une date spécifique
Route::get('/pointages/statistiques/{date}', [PointageController::class, 'getStatistiquesPointages']);


// Groupe de routes pour les APIs de HistoricPointage
Route::prefix('historic-pointages')->group(function () {
    Route::get('/', [HistoricPointageController::class, 'index']); // Lister tous les historiques
    Route::post('/', [HistoricPointageController::class, 'store']); // Créer un historique
    Route::get('/{id}', [HistoricPointageController::class, 'show']); // Voir un historique spécifique
    Route::put('/{id}', [HistoricPointageController::class, 'update']); // Mettre à jour un historique
    Route::delete('/{id}', [HistoricPointageController::class, 'destroy']); // Supprimer un historique
});



Route::apiResource('utilisateurs', UtilisateurController::class);


Route::get('employers/{departement}', [UtilisateurController::class, 'getEmployersByDepartment']);



Route::get('/utilisateurs/apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getApprenantsByCohorte']);
Route::get('/utilisateurs/liste-apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getListeApprenantsByCohorte']);


Route::post('/assign-card', [UtilisateurController::class, 'assignCard']);




Route::post('login', [UtilisateurController::class, 'login']);
// Dans api.php

Route::post('login-by-card', [UtilisateurController::class, 'loginByCardId']);


// Ajoutez cette route pour vérifier l'existence de la carte
Route::get('check-card-id/{cardId}', [UtilisateurController::class, 'checkCardIdExists']);





Route::apiResource('departements', DepartementController::class);
Route::apiResource('cohortes', CohorteController::class);

// routes/api.php
Route::patch('/utilisateurs/{id}/bloquer', [UtilisateurController::class, 'bloquer']);

Route::get('/telephones/{telephone}', [UtilisateurController::class, 'checkTelephoneExists']);


Route::post('/create-pointage', [PointageController::class, 'createPointage']);



// Route pour obtenir le nombre d'utilisateurs présents par jour


Route::get('/pointages/daily-presence/{date}', [PointageController::class, 'getDailyPresenceCount']);


Route::get('/utilisateurs/employers/count', [UtilisateurController::class, 'countEmployers']);
