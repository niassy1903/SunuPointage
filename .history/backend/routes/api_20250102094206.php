<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CohorteController;
use App\Http\Controllers\PointageController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');





// Route pour récupérer tous les pointages
Route::get('/pointages', [PointageController::class, 'index']);

// Route pour récupérer un pointage spécifique par ID
Route::get('/pointages/{id}', [PointageController::class, 'show']);

// Route pour créer un pointage
Route::post('/pointages', [PointageController::class, 'store']);

// Route pour mettre à jour un pointage
Route::put('/pointages/{id}', [PointageController::class, 'update']);

Route::get('/pointage/{cardId}', [PointageController::class, 'getPointageByCardId']);




Route::apiResource('utilisateurs', UtilisateurController::class);


Route::get('employers/{departement}', [UtilisateurController::class, 'getEmployersByDepartment']);



Route::get('/utilisateurs/apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getApprenantsByCohorte']);


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
