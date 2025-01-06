<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Client;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $client = new Client(config('database.connections.mongodb.dsn'));
        $database = $client->selectDatabase(config('database.connections.mongodb.database'));
        $database->createCollection('historic_pointages');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $client = new Client(config('database.connections.mongodb.dsn'));
        $database = $client->selectDatabase(config('database.connections.mongodb.database'));
        $database->dropCollection('historic_pointages');
    }
};
