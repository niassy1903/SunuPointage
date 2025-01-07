<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckFonction; // Importation du middleware
use Illuminate\Auth\Middleware\Authenticate;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
         // Enregistrer le middleware avec un alias
         $middleware->alias([
            'check.fonction' => CheckFonction::class, // Définir un alias
        ]);
         // Ajouter les middlewares pour le groupe 'api'
         $middleware->group('api', [
            Authenticate::class, // Middleware JWT
            'throttle:api',       // Limitation des requêtes pour l'API
            \Illuminate\Routing\Middleware\SubstituteBindings::class, // Middleware pour substituer les bindings
            'check.fonction',     // Ajouter votre middleware personnalisé
        ]);

        // Ajouter d'autres groupes de middlewares si nécessaire
        $middleware->group('web', [
            // Ajoutez ici vos middlewares pour le groupe web
        ]);
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

    