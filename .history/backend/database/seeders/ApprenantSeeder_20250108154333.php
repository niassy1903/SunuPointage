<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use Carbon\Carbon;

class ApprenantSeeder extends Seeder
{
    public function run()
    {
        // Cohortes disponibles
        $cohortes = [
            'repellat',
            'aut',
            'omnis',
            'optio',
            'quaerat',
            'fuga'
        ];

        // Ajouter des apprenants pour chaque cohorte
        foreach ($cohortes as $cohorte) {
            // Création de 10 apprenants pour chaque cohorte
            for ($i = 1; $i <= 10; $i++) {
                Utilisateur::create([
                    'nom' => 'Nom' . $i,
                    'prenom' => 'Prénom' . $i,
                    'email' => 'apprenant' . $i . '@example.com',
                    'adresse' => 'Adresse de l\'apprenant ' . $i,
                    'telephone' => '123456789' . $i,
                    'fonction' => 'apprenant', // Assurez-vous que la fonction est bien "apprenant"
                    'photo' => null, // Vous pouvez ajouter une photo si nécessaire
                    'departement' => 'Informatique',
                    'cohorte' => $cohorte, // Affectation de la cohorte
                    'mot_de_passe' => 'password123', // Vous pouvez générer un mot de passe plus sécurisé
                    'card_id' => null, // Ajoutez la logique de card_id si nécessaire
                    'status' => 'actif',
                ]);
            }
        }

        $this->command->info('Les apprenants ont été ajoutés aux cohortes avec succès!');
    }
}
