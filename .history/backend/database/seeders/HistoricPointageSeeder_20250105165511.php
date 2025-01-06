<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoricPointage;
use App\Models\Utilisateur;
use Illuminate\Support\Str;

class HistoricPointageSeeder extends Seeder
{
    public function run()
    {
        // Récupérer tous les utilisateurs disponibles
        $utilisateurs = Utilisateur::all();

        if ($utilisateurs->isEmpty()) {
            $this->command->warn("Aucun utilisateur trouvé dans la base de données.");
            return;
        }

        // Générer 50 enregistrements
        for ($i = 0; $i < 50; $i++) {
            HistoricPointage::create([
                'utilisateur_id' => $utilisateurs->random()->_id, // Utilisateur aléatoire
                'action' => $this->getRandomAction(), // Action aléatoire
                'detail' => 'Détail de l\'action ' . Str::random(10),
                'created_at' => now(),
            ]);
        }

        $this->command->info("50 enregistrements ajoutés dans la collection `historic_pointages`.");
    }

    /**
     * Retourne une action aléatoire.
     *
     * @return string
     */
    private function getRandomAction()
    {
        $actions = [
            'Création de pointage',
            'Modification de pointage',
            'Suppression de pointage',
            'Validation de pointage',
            'Consultation de pointage',
        ];

        return $actions[array_rand($actions)];
    }
}
