<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Cohorte; // Importation du modèle Cohorte
use App\Models\Departement; // Importation du modèle Departement
use Illuminate\Support\Str;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('fr_FR'); // Utilisation de la locale française pour des données réalistes

        // Récupération des cohortes et départements existants
        $cohortes = Cohorte::all(); // Récupère toutes les cohortes existantes dans la base de données
        $departements = Departement::all(); // Récupère tous les départements existants dans la base de données

        // Liste des fonctions d'utilisateur
        $fonctions = ['apprenant', 'vigile', 'admin', 'employer'];

        for ($i = 0; $i < 10; $i++) {
            $fonction = $faker->randomElement($fonctions);
            
            // Initialisation des données spécifiques
            $cohorte = null;
            $departement = null;

            // Si la fonction est 'apprenant', on attribue une cohorte
            if ($fonction === 'apprenant' && $cohortes->isNotEmpty()) {
                $cohorte = $faker->randomElement($cohortes);
            }

            // Si la fonction n'est pas 'vigile', on attribue un département
            if ($fonction !== 'vigile' && $departements->isNotEmpty()) {
                $departement = $faker->randomElement($departements);
            }

            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => $fonction,
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => $departement ? $departement->nom : null, // Attribuer un département si ce n'est pas 'vigile'
                'cohorte' => $cohorte ? $cohorte->nom : null, // Attribuer une cohorte si l'utilisateur est un apprenant
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }
    }
}
