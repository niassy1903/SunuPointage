<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CohorteController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::apiResource('utilisateurs', UtilisateurController::class);


Route::get('employers/{departement}', [UtilisateurController::class, 'getEmployersByDepartment']);



Route::get('/utilisateurs/apprenants-par-cohorte/{cohorte}', [UtilisateurController::class, 'getApprenantsByCohorte']);







Route::post('login', [UtilisateurController::class, 'login']);



Route::apiResource('departements', DepartementController::class);
Route::apiResource('cohortes', CohorteController::class);

// routes/api.php
Route::patch('/utilisateurs/{id}/bloquer', [UtilisateurController::class, 'bloquer']);

Route::get('/telephones/{telephone}', [UtilisateurController::class, 'checkTelephoneExists']);
