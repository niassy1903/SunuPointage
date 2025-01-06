<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Client;

class CreatePasswordResetsCollection extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Connexion à MongoDB
        $client = new Client(env('DB_CONNECTION_STRING'));
        $database = $client->selectDatabase(env('DB_DATABASE'));

        // Création de la collection
        $database->createCollection('password_resets');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Connexion à MongoDB
        $client = new Client(env('DB_CONNECTION_STRING'));
        $database = $client->selectDatabase(env('DB_DATABASE'));

        // Suppression de la collection
        $database->dropCollection('password_resets');
    }
}
