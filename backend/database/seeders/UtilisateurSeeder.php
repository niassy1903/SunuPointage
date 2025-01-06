<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $prenoms = [
            "Amadou", "Mamadou", "Cheikh", "Ibrahima", "El Hadji",
            "Modou", "Moustapha", "Aliou", "Serigne", "Boubacar",
            "Aminata", "Adama", "Fatou", "Mariama", "Coumba",
            "Awa", "Sokhna", "Astou", "Bineta", "Khady"
        ];

        $noms = [
            "Sarr", "Ndiaye", "Sow", "Faye", "Kane",
            "Ba", "Gueye", "Diatta", "Seck", "Thiam",
            "Niang", "Camara", "Mbaye", "Touré", "Diallo", "Sy",
            "Fall", "Diop", "Diouf", "Ngom", "Mbengue",
            "Diagne", "Ndoye", "Ndour", "Sène", "Guèye",
            "Badji", "Cissé", "Dia", "Ka", "Lô",
            "Mbodj", "Ndiaye", "Niane", "Samb", "Traoré"
        ];


     

        $adresses = [
            "Dakar", "Keur Massar", "Almadies", "Ngor", "Rufisque"
        ];

        for ($i = 0; $i < 50; $i++) {
            $prenom = $prenoms[array_rand($prenoms)];
            $nom = $noms[array_rand($noms)];
            $email = strtolower("$prenom.$nom@gmail.com");
            $adresse = $adresses[array_rand($adresses)];
            $matricule = $this->generateMatricule($i);

            Utilisateur::create([
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => $email,
                'adresse' => $adresse,
                'telephone' => '773862943',
                'fonction' => 'vigile',
                
                'mot_de_passe' => bcrypt('password'), // Assurez-vous de hacher le mot de passe
               
                'card_id' => 'CARD' . str_pad($i + 1, 4, '0', STR_PAD_LEFT), // Générer un card_id unique
                'matricule' => $matricule // Générer un matricule unique
            ]);
        }
    }

    protected function generateMatricule($index)
    {
        $year = date('Y');
        $number = $index + 1;
        return "MATRICULE-{$year}-" . str_pad($number, 3, '0', STR_PAD_LEFT);
    }
}
