<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Models\User;


Route::get('/', function () {
    return view('welcome');
});



Route::get('/insert-user', function () {
    // Créer un utilisateur
    $user = User::create([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'password' => ('password123'),
    ]);

    return response()->json($user);
});

Route::post('/create-user', [UserController::class, 'store']);


Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
