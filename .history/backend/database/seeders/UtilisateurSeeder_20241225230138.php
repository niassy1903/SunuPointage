<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UtilisateurSeeder extends Seeder
{
    public function run()
    {
        // Initialisation de Faker pour générer des données factices
        $faker = Faker::create('fr_FR'); // Utiliser un locale français pour générer des noms, prénoms et numéros

        // Créer un administrateur
        Utilisateur::create([
            'nom' => 'Admin',
            'prenom' => 'Admin',
            'email' => 'admin@exemple.com',
            'adresse' => $faker->address,
            'telephone' => $this->generateTelephone(),
            'fonction' => 'admin',
            'photo' => 'https://randomuser.me/api/portraits/men/1.jpg', // Exemple d'avatar
            'mot_de_passe' => bcrypt('passer123'),
            'date_creation' => Carbon::now(),
            'date_suppression' => null,
            'date_modification' => null,
            'departement' => 'Digital', // Département prédéfini pour l'admin
            'cohorte' => $this->randomCohorte(),
            'matricule' => 'ADMIN001',
            'status' => 'actif',
        ]);

        // Créer 199 autres utilisateurs avec des rôles divers
        for ($i = 0; $i < 199; $i++) {
            $fonction = $this->randomFonction(); // Fonction aléatoire (apprenant, vigile, employe)

            Utilisateur::create([
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'adresse' => $faker->address,
                'telephone' => $this->generateTelephone(),
                'fonction' => $fonction,
                'photo' => $this->generateAvatar(),
                'mot_de_passe' => bcrypt('passer123'),
                'date_creation' => Carbon::now(),
                'date_suppression' => null,
                'date_modification' => null,
                'departement' => $this->randomDepartement(),
                'cohorte' => $this->randomCohorte(),
                'matricule' => $this->generateMatricule($fonction),
                'status' => 'actif',
            ]);
        }
    }

    // Fonction pour générer un numéro de téléphone sénégalais aléatoire
    private function generateTelephone()
    {
        // Format d'un numéro de téléphone sénégalais : +221 77 123 45 67
        return '+221 ' . rand(70, 79) . ' ' . rand(1000000, 9999999);
    }

    // Fonction pour retourner une fonction aléatoire
    private function randomFonction()
    {
        $fonctions = ['apprenant', 'vigile', 'employer'];
        return $fonctions[array_rand($fonctions)];
    }

    // Fonction pour générer un avatar aléatoire
    private function generateAvatar()
    {
        $avatars = [
            'https://randomuser.me/api/portraits/men/1.jpg',
            'https://randomuser.me/api/portraits/men/2.jpg',
            'https://randomuser.me/api/portraits/men/3.jpg',
            'https://randomuser.me/api/portraits/men/4.jpg',
            'https://randomuser.me/api/portraits/men/5.jpg',
        ];
        return $avatars[array_rand($avatars)];
    }

    // Fonction pour générer un département aléatoire
    private function randomDepartement()
    {
        $departements = ['Digital', 'Marketing', 'Informatique', 'Ressources Humaines', 'Finance', 'Logistique'];
        return $departements[array_rand($departements)];
    }

    // Fonction pour générer une cohorte aléatoire
    private function randomCohorte()
    {
        $cohortes = ['Informatique', 'Développement Mobile', 'Data Science', 'Marketing Digital', 'UX/UI Design'];
        return $cohortes[array_rand($cohortes)];
    }

    // Fonction pour générer un matricule en fonction de la fonction
    private function generateMatricule($fonction)
    {
        $prefixes = [
            'apprenant' => 'AP',
            'vigile' => 'VG',
            'employer' => 'EM',
            'admin' => 'ADM'
        ];

        $prefix = $prefixes[$fonction] ?? 'EM'; // Si la fonction n'existe pas, utiliser 'EM' comme fallback
        return $prefix . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);
    }
}
