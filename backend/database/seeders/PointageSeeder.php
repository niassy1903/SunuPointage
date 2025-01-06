<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pointage;
use Carbon\Carbon;

class PointageSeeder extends Seeder
{
    public function run()
    {
        $dateActuelle = Carbon::now()->toDateString(); // Date actuelle
        $employes = [
            ["carte_id" => "C001", "nom" => "Diop", "prenom" => "Ndiawar"],
            ["carte_id" => "C002", "nom" => "Ndiaye", "prenom" => "Fatou"],
            ["carte_id" => "C003", "nom" => "Ba", "prenom" => "Aliou"],
            ["carte_id" => "C004", "nom" => "Faye", "prenom" => "Mariam"],
        ];

        foreach ($employes as $employe) {
            $statut = $this->determinerStatut();
            $heureArrivee = $this->genererHeureArrivee($statut);
            $heureDepart = $statut === 'absent' ? null : Carbon::createFromTime(17, rand(0, 30))->format('H:i');
            $tempsTravail = $heureArrivee && $heureDepart
                ? Carbon::createFromFormat('H:i', $heureDepart)->diffInMinutes(Carbon::createFromFormat('H:i', $heureArrivee))
                : null;

            Pointage::create([
                'carte_id' => $employe['carte_id'],
                'nom' => $employe['nom'],
                'prenom' => $employe['prenom'],
                'date_actuelle' => $dateActuelle,
                'heure_arrivee' => $heureArrivee,
                'heure_depart' => $heureDepart,
                'statut' => $statut,
                'temps_travail' => $tempsTravail,
            ]);
        }
    }

    private function determinerStatut()
    {
        $statuts = ['present', 'retard', 'depart_anticipé', 'depart_tardif', 'absent', 'congé', 'malade'];
        $poids = [50, 20, 10, 10, 5, 3, 2];

        $random = rand(1, array_sum($poids));
        $cumul = 0;

        foreach ($statuts as $index => $statut) {
            $cumul += $poids[$index];
            if ($random <= $cumul) {
                return $statut;
            }
        }

        return 'absent';
    }

    private function genererHeureArrivee($statut)
    {
        if ($statut === 'present') {
            return Carbon::createFromTime(8, rand(30, 45))->format('H:i');
        } elseif ($statut === 'retard') {
            return Carbon::createFromTime(8, 45)->addMinutes(rand(1, 120))->format('H:i');
        }

        return null;
    }
}
