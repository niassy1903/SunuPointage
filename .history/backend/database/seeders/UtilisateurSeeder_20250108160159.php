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

        // Définition du nombre d'utilisateurs par fonction
        $numberOfVigiles = 2;
        $numberOfAdmins = 2;
        $numberOfEmployees = 5;
        $numberOfApprenants = 30;

        // Liste des fonctions d'utilisateur
        $fonctions = ['apprenant', 'vigile', 'admin', 'employer'];

        // Création des vigiles
        for ($i = 0; $i < $numberOfVigiles; $i++) {
            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => 'vigile',
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => null, // Les vigiles n'ont pas de département
                'cohorte' => null, // Les vigiles n'ont pas de cohorte
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }

        // Création des admins
        for ($i = 0; $i < $numberOfAdmins; $i++) {
            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => 'admin',
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => $faker->randomElement($departements)->nom, // Attribution d'un département
                'cohorte' => null, // Les admins n'ont pas de cohorte
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }

        // Création des employés
        for ($i = 0; $i < $numberOfEmployees; $i++) {
            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => 'employer',
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => $faker->randomElement($departements)->nom, // Attribution d'un département
                'cohorte' => null, // Les employés n'ont pas de cohorte
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }

        // Création des apprenants
        for ($i = 0; $i < $numberOfApprenants; $i++) {
            $cohorte = $faker->randomElement($cohortes); // Attribution d'une cohorte pour les apprenants
            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => 'apprenant',
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => null, // Les apprenants n'ont pas de département
                'cohorte' => $cohorte->nom, // Attribution d'une cohorte
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }
    }
}
