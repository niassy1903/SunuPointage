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
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            Cohorte::create([
                'nom' => $faker->unique()->word,
                'annee_creation' => $faker->dateTimeBetween('-10 years', 'now'),
                'description' => $faker->sentence(10),
            ]);
        }
    }
}
