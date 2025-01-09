<?php


use App\Http\Controllers\Auth\ForgotPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CohorteController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\HistoricPointageController;

// Routes publiques (non sécurisées)
Route::post('login', [UtilisateurController::class, 'login']);
Route::post('login-by-card', [UtilisateurController::class, 'loginByCardId']);
Route::get('check-card-id/{cardId}', [UtilisateurController::class, 'checkCardIdExists']);
Route::post('password/forgot', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword']);

// Routes liées aux utilisateurs
Route::get('/utilisateurs/card/{cardId}', [UtilisateurController::class, 'getUtilisateurByCardId']);
Route::get('employers/{departement}', [UtilisateurController::class, 'getEmployersByDepartment']);
Route::get('/utilisateurs/apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getApprenantsByCohorte']);
Route::get('/utilisateurs/liste-apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getListeApprenantsByCohorte']);
Route::post('/assign-card', [UtilisateurController::class, 'assignCard']);
Route::patch('/utilisateurs/{id}/bloquer', [UtilisateurController::class, 'bloquer']);
Route::get('/telephones/{telephone}', [UtilisateurController::class, 'checkTelephoneExists']);
Route::put('/utilisateurs/{id}/reactiver', [UtilisateurController::class, 'reactiver']);
Route::post('/utilisateurs/reactiver-multiple', [UtilisateurController::class, 'reactiverMultiple']);


// Routes liées aux pointages
Route::get('/pointages', [PointageController::class, 'index']);
Route::get('/pointages/{id}', [PointageController::class, 'show']);
Route::post('/pointages', [PointageController::class, 'store']);
Route::put('/pointages/{id}', [PointageController::class, 'update']);
Route::get('/pointage/{cardId}', [PointageController::class, 'getPointageByCardId']);
Route::get('/pointages/totals/{date}', [PointageController::class, 'getTotalPointages']);
Route::get('/pointages/validations/{date}', [PointageController::class, 'getTotalValidations']);
Route::get('/pointages/rejets/{date}', [PointageController::class, 'getTotalRejets']);
Route::get('/pointages/statistiques/{date}', [PointageController::class, 'getStatistiquesPointages']);
Route::post('/create-pointage', [PointageController::class, 'createPointage']);

// Routes liées à HistoricPointage
Route::prefix('historic-pointages')->group(function () {
    Route::get('/', [HistoricPointageController::class, 'index']);
    Route::post('/', [HistoricPointageController::class, 'store']);
    Route::get('/{id}', [HistoricPointageController::class, 'show']);
    Route::put('/{id}', [HistoricPointageController::class, 'update']);
    Route::delete('/{id}', [HistoricPointageController::class, 'destroy']);
});
// Routes liées aux départements et cohortes
Route::apiResource('departements', DepartementController::class);
Route::apiResource('cohortes', CohorteController::class);
Route::get('/cohortes/check/{id}', [CohorteController::class, 'checkExistence']);

Route::post('/logout', [UtilisateurController::class, 'logout']);
Route::apiResource('utilisateurs', UtilisateurController::class);

// Toutes les autres routes nécessitent une authentification JWT
Route::middleware(['jwt.auth'])->group(function () {
    // Route pour obtenir l'utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    
});

// Route pour obtenir le nombre d'utilisateurs présents par jour
Route::get('/pointages/daily-presence/{date}', [PointageController::class, 'getDailyPresenceCount']);
Route::get('/utilisateurs/employers/count', [UtilisateurController::class, 'countEmployers']);


Route::get('/check-email/{email}', [UtilisateurController::class, 'checkEmailExists']);
Route::get('/check-telephone/{telephone}', [UtilisateurController::class, 'checkTelephoneExists']);


Route::delete('utilisateurs/supprimer-multiple', [UtilisateurController::class, 'destroyMultiple']);
