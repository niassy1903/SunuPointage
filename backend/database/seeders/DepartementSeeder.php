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
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            Departement::create([
                'nom' => $faker->unique()->company,
                'annee_creation' => $faker->dateTimeBetween('-30 years', 'now'),
                'description' => $faker->sentence(10),
            ]);
        }
    }
}
