<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use Illuminate\Support\Str;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $fonctions = ['apprenant', 'vigile', 'admin', 'employer'];
        $departements = ['IT', 'Marketing', 'Finance', 'RH', 'Opérations'];
        $cohortes = ['Cohorte 1', 'Cohorte 2', 'Cohorte 3'];

        for ($i = 0; $i < 50; $i++) {
            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $faker->unique()->phoneNumber,
                'fonction' => $faker->randomElement($fonctions),
                'photo' => $faker->imageUrl(100, 100, 'people'),
                'mot_de_passe' => 'password123', // Le mot de passe sera automatiquement haché
                'departement' => $faker->randomElement($departements),
                'cohorte' => $faker->randomElement($cohortes),
                'matricule' => strtoupper(Str::random(8)),
                'status' => $faker->randomElement(['actif', 'inactif']),
                'card_id' => strtoupper(Str::random(10)),
            ]);
        }
    }
}
