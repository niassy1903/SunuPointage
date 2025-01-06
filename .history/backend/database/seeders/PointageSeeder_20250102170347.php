<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pointage;
use Illuminate\Support\Carbon;

class PointageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $statuts = [
            Pointage::STATUT_ABSENT,
            Pointage::STATUT_MALADE,
            Pointage::STATUT_CONGE,
            Pointage::STATUT_PRESENT,
            Pointage::STATUT_RETARD,
        ];

        for ($i = 0; $i < 50; $i++) {
            $heureArrivee = $faker->time('H:i');
            $heureDepart = $faker->optional(0.8)->time('H:i'); // 80% de probabilité d'avoir une heure de départ
            $tempsTravail = null;

            // Calcul du temps de travail si heure d'arrivée et de départ sont définies
            if ($heureArrivee && $heureDepart) {
                $arrivee = Carbon::createFromFormat('H:i', $heureArrivee);
                $depart = Carbon::createFromFormat('H:i', $heureDepart);
                $tempsTravail = $depart->diffInMinutes($arrivee);
            }

            Pointage::create([
                'carte_id' => strtoupper($faker->bothify('CARD-#######')),
                'nom' => $faker->lastName,
                'prenom' => $faker->firstName,
                'date_actuelle' => $faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                'heure_arrivee' => $heureArrivee,
                'heure_depart' => $heureDepart,
                'statut' => $faker->randomElement($statuts),
                'temps_travail' => $tempsTravail,
            ]);
        }
    }
}
