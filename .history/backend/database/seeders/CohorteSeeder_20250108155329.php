<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cohorte;

class CohorteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('fr_FR');  // Utilisation de la locale française pour des données réalistes

        // Liste de 10 formations spécifiques à la formation en informatique
        $formations = [
            'Développeur Web',
            'Administrateur Systèmes et Réseaux',
            'Ingénieur en Intelligence Artificielle',
            'Expert en Cybersécurité',
            'Technicien en Maintenance Informatique',
            'Data Scientist',
            'Développeur Mobile',
            'Chef de Projet Informatique',
            'Analyste de Données',
            'Spécialiste en Cloud Computing'
        ];

        // Crée exactement 10 cohortes avec des noms et descriptions réalistes
        foreach ($formations as $formation) {
            Cohorte::create([
                'nom' => $formation,
                'annee_creation' => $faker->dateTimeBetween('-5 years', 'now'), // Année de création entre 5 ans
                'description' => $this->generateDescription($formation),
            ]);
        }

        $this->command->info('10 Cohortes de formations informatiques créées avec succès!');
    }

    /**
     * Fonction pour générer des descriptions réalistes selon le domaine de la formation
     *
     * @param string $formation
     * @return string
     */
    private function generateDescription($formation)
    {
        switch ($formation) {
            case 'Développeur Web':
                return "Cette formation vous permettra de maîtriser les technologies modernes du web telles que HTML, CSS, JavaScript et PHP. Vous apprendrez à créer des sites web performants et réactifs.";
            case 'Administrateur Systèmes et Réseaux':
                return "Formation en gestion des systèmes informatiques, des serveurs et des réseaux. Vous apprendrez à configurer, maintenir et sécuriser des infrastructures informatiques.";
            case 'Ingénieur en Intelligence Artificielle':
                return "Formation avancée en IA, machine learning et deep learning. Vous apprendrez à concevoir et à déployer des modèles d'intelligence artificielle pour résoudre des problématiques complexes.";
            case 'Expert en Cybersécurité':
                return "Cette formation vous formera à l'analyse des vulnérabilités des systèmes et à la mise en place de stratégies de sécurité pour protéger les données sensibles et les infrastructures informatiques.";
            case 'Technicien en Maintenance Informatique':
                return "Apprenez à diagnostiquer, entretenir et réparer des équipements informatiques. Cette formation couvre également la gestion des périphériques et l'assistance technique aux utilisateurs.";
            case 'Data Scientist':
                return "Formation spécialisée dans l'analyse de données massives, l'exploration de données, et la création de modèles prédictifs. Vous apprendrez à travailler avec Python, R et SQL pour exploiter des données complexes.";
            case 'Développeur Mobile':
                return "Formation dédiée à la création d'applications mobiles pour les plateformes Android et iOS. Vous apprendrez à concevoir, développer et déployer des applications mobiles modernes.";
            case 'Chef de Projet Informatique':
                return "Cette formation vous prépare à gérer des projets informatiques en coordonnant les équipes techniques et en assurant la gestion du temps, des coûts et des risques associés aux projets.";
            case 'Analyste de Données':
                return "Formation en analyse des données d'entreprise, en utilisant des outils comme Excel, Power BI, et des techniques statistiques pour obtenir des informations exploitables et aider à la prise de décision.";
            case 'Spécialiste en Cloud Computing':
                return "Formation sur les technologies de cloud computing, notamment AWS, Azure et Google Cloud. Vous apprendrez à déployer et à gérer des applications dans des environnements cloud sécurisés et évolutifs.";
            default:
                return "Formation professionnelle en informatique.";
        }
    }
}
