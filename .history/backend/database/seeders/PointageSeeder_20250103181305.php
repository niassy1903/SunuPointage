<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pointage;
use Carbon\Carbon;

class PointageSeeder extends Seeder
{
    public function run()
    {
        // Période de pointage
        $debut = Carbon::create(2025, 1, 3);
        $fin = Carbon::create(2025, 1, 8);

        // Simulation de cartes et employés
        $employes = [
            ["carte_id" => "C001", "nom" => "Diop", "prenom" => "Ndiawar"],
            ["carte_id" => "C002", "nom" => "Ndiaye", "prenom" => "Fatou"],
            ["carte_id" => "C003", "nom" => "Ba", "prenom" => "Aliou"],
            ["carte_id" => "C004", "nom" => "Faye", "prenom" => "Mariam"],
        ];

        while ($debut <= $fin) {
            foreach ($employes as $employe) {
                $statut = $this->determinerStatut();

                $heureArrivee = null;
                $heureDepart = null;
                $validation = rand(0, 1) ? 'validée' : 'rejetée';
                $tempsTravail = null;

                if ($statut === Pointage::STATUT_PRESENT || $statut === Pointage::STATUT_RETARD) {
                    $heureArrivee = $this->genererHeureArrivee($statut);
                    $heureDepart = Carbon::createFromTime(17, 0)->format('H:i');
                    $tempsTravail = Carbon::createFromFormat('H:i', $heureDepart)
                        ->diffInMinutes(Carbon::createFromFormat('H:i', $heureArrivee));
                }

                Pointage::create([
                    'carte_id' => $employe['carte_id'],
                    'nom' => $employe['nom'],
                    'prenom' => $employe['prenom'],
                    'date_actuelle' => $debut->toDateString(),
                    'heure_arrivee' => $heureArrivee,
                    'heure_depart' => $heureDepart,
                    'statut' => $statut,
                    'temps_travail' => $tempsTravail,
                    'validation' => $validation,
                ]);
            }

            $debut->addDay();
        }
    }

    private function determinerStatut()
    {
        $statuts = [
            Pointage::STATUT_PRESENT,
            Pointage::STATUT_RETARD,
            Pointage::STATUT_ABSENT,
            Pointage::STATUT_MALADE,
            Pointage::STATUT_CONGE,
        ];

        $poids = [60, 20, 10, 5, 5]; // Probabilités pondérées

        $random = rand(1, array_sum($poids));
        $cumul = 0;

        foreach ($statuts as $index => $statut) {
            $cumul += $poids[$index];
            if ($random <= $cumul) {
                return $statut;
            }
        }

        return Pointage::STATUT_ABSENT; // Défaut
    }

    private function genererHeureArrivee($statut)
    {
        if ($statut === Pointage::STATUT_PRESENT) {
            return Carbon::createFromTime(8, 30)->format('H:i');
        } elseif ($statut === Pointage::STATUT_RETARD) {
            return Carbon::createFromTime(8, 31)->addMinutes(rand(1, 120))->format('H:i');
        }

        return null;
    }
}
