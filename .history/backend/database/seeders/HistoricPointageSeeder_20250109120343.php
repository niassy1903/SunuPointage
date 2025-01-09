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
        for ($i = 0; $i < 15; $i++) {
            // Sélectionner un utilisateur aléatoire
            $utilisateur = $utilisateurs->random();
            
            // Créer un enregistrement pour l'historique
            HistoricPointage::create([
                'utilisateur_id' => $utilisateur->_id, // Utilisation du champ _id spécifique à MongoDB
                'action' => $this->getRandomAction(), // Action aléatoire
                'detail' => 'Détail de l\'action ' . Str::random(10), // Détail aléatoire
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
            // Actions liées au pointage
            'Création de pointage',
            'Modification de pointage',
            'Suppression de pointage',
            'Validation de pointage',
            'Consultation de pointage',

            // Actions liées aux utilisateurs
            'Ajout d\'utilisateur',
            'Modification d\'utilisateur',
            'Suppression d\'utilisateur',
            'Activation d\'utilisateur',
            'Désactivation d\'utilisateur',
            'Consultation d\'utilisateur',
        ];

        return $actions[array_rand($actions)];
    }
}
