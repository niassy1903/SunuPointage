<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('fr_FR'); // Utilisation de la locale française pour des données réalistes

        // Liste de départements adaptés à la formation professionnelle en informatique
        $departements = [
            'Développement Web',
            'Cybersécurité',
            'Infrastructure et Réseaux',
            'Data Science',
            'Intelligence Artificielle',
            'Cloud Computing',
            'Gestion de Projets Informatiques',
            'Support Technique',
            'Testing et QA',
            'Ressources Humaines'
        ];

        // Crée exactement 10 départements avec des noms et descriptions réalistes
        foreach ($departements as $departement) {
            Departement::create([
                'nom' => $departement,
                'annee_creation' => $faker->dateTimeBetween('-10 years', 'now'), // Année de création entre 10 ans
                'description' => $this->generateDescription($departement),
            ]);
        }

        $this->command->info('10 départements créés avec succès!');
    }

    /**
     * Fonction pour générer des descriptions réalistes pour chaque département
     *
     * @param string $departement
     * @return string
     */
    private function generateDescription($departement)
    {
        switch ($departement) {
            case 'Développement Web':
                return "Département en charge de la création, du développement et de l'entretien des sites web et des applications web. Utilisation des technologies modernes comme HTML, CSS, JavaScript et PHP.";
            case 'Cybersécurité':
                return "Ce département assure la protection des systèmes et des données contre les cybermenaces, les attaques et les violations de sécurité. Il met en place des stratégies pour garantir la confidentialité et l'intégrité des données.";
            case 'Infrastructure et Réseaux':
                return "Responsable de la gestion des infrastructures informatiques, des serveurs, des réseaux et des systèmes. Ce département veille à la disponibilité et à la performance des systèmes informatiques de l'entreprise.";
            case 'Data Science':
                return "Département dédié à l'analyse de données massives et à l'utilisation de modèles d'intelligence artificielle pour extraire des informations utiles à partir de données complexes et aider à la prise de décision.";
            case 'Intelligence Artificielle':
                return "Ce département se concentre sur le développement et l'intégration des systèmes intelligents, tels que les algorithmes de machine learning, deep learning et l'automatisation des processus métiers.";
            case 'Cloud Computing':
                return "Spécialisé dans la gestion des services cloud. Ce département met en place des solutions cloud, gère les ressources et assure la scalabilité et la sécurité des données et des applications hébergées dans le cloud.";
            case 'Gestion de Projets Informatiques':
                return "Ce département est responsable de la gestion des projets informatiques, de la planification à la livraison des solutions logicielles. Il assure la coordination des équipes et la gestion des risques.";
            case 'Support Technique':
                return "En charge de la maintenance et du support technique pour les utilisateurs. Ce département s'assure que les équipements et logiciels fonctionnent correctement et répond aux demandes d'assistance.";
            case 'Testing et QA':
                return "Le département qualité et test assure la validation des applications logicielles en mettant en place des tests unitaires et fonctionnels pour garantir leur bon fonctionnement avant leur mise en production.";
            case 'Ressources Humaines':
                return "Gestion des talents, des compétences et du recrutement au sein de l'entreprise. Ce département s'assure de la bonne organisation et de la gestion des carrières et du développement professionnel des employés.";
            default:
                return "Département professionnel lié à la formation ou à la gestion des ressources humaines et technologiques.";
        }
    }
}
