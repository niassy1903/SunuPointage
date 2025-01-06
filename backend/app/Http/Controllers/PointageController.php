<?php

namespace App\Http\Controllers;

use App\Models\Pointage;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class PointageController extends Controller
{
    // Afficher tous les pointages
    public function index()
    {
        $pointages = Pointage::all();
        return response()->json($pointages);
    }

    // Afficher un pointage spécifique
    public function show($id)
    {
        $pointage = Pointage::findOrFail($id);
        return response()->json($pointage);
    }

    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'carte_id' => 'required|string',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'heure_arrivee' => 'nullable|date_format:H:i',
            'heure_depart' => 'nullable|date_format:H:i',
            'statut' => 'nullable|in:present,absent,malade,conge,retard,rejeter',
        ]);
    
        $today = Carbon::now()->toDateString();
    
        // Vérification de pointage existant
        $existingPointage = Pointage::where('carte_id', $validatedData['carte_id'])
            ->where('date_actuelle', $today)
            ->first();
    
        if ($existingPointage) {
            return response()->json([
                'error' => 'Un pointage existe déjà pour cette carte aujourd\'hui',
                'carte_id' => $validatedData['carte_id']
            ], 400);
        }
    
        // Création du pointage
        $validatedData['date_actuelle'] = $today;
        $validatedData['heure_depart'] = $validatedData['heure_depart'] ?? null;
        $pointage = Pointage::create($validatedData);
    
        return response()->json($pointage, 201);
    }
    


public function createPointage(Request $request)
{
    $validatedData = $request->validate([
        '*.carte_id' => 'required|string',
        '*.nom' => 'required|string',
        '*.prenom' => 'required|string',
        '*.heure_arrivee' => 'nullable|date_format:H:i',
        '*.heure_depart' => 'nullable|date_format:H:i',
        '*.statut' => 'nullable|in:present,absent,malade,conge,retard,rejeter',
    ]);

    $today = Carbon::now()->toDateString();
    $createdPointages = [];

    foreach ($validatedData as $data) {
        $existingPointage = Pointage::where('carte_id', $data['carte_id'])
            ->where('date_actuelle', $today)
            ->first();

        if ($existingPointage) {
            return response()->json([
                'error' => 'Un pointage existe déjà pour cette carte aujourd\'hui',
                'carte_id' => $data['carte_id']
            ], 400);
        }

        $data['date_actuelle'] = $today;
        $data['heure_depart'] = $data['heure_depart'] ?? null;
        $pointage = Pointage::create($data);
        $createdPointages[] = $pointage;
    }

    return response()->json($createdPointages, 201);
}



    // Fonction pour obtenir un pointage par carte_id
    public function getPointageByCardId($cardId)
    {
        $today = Carbon::today()->toDateString();

        // Log pour vérifier la requête
        Log::debug('Recherche pointage avec carte_id:', ['carte_id' => $cardId, 'date' => $today]);

        $pointage = Pointage::where('carte_id', $cardId)
            ->whereDate('date_actuelle', $today)
            ->first();

        if ($pointage) {
            return response()->json($pointage);
        } else {
            return response()->json(['message' => 'Pointage non trouvé'], 404);
        }
    }

   // Mettre à jour un pointage existant à partir du carte_id
public function update(Request $request, $carte_id)
{
    $validatedData = $request->validate([
        'heure_depart' => 'nullable|date_format:H:i', // Champ facultatif
    ]);

    $today = Carbon::today()->toDateString();

    // Recherche du pointage par carte_id et date_actuelle
    $pointage = Pointage::where('carte_id', $carte_id)
        ->whereDate('date_actuelle', $today)
        ->first();

    if (!$pointage) {
        return response()->json(['error' => 'Pointage non trouvé pour ce carte_id aujourd\'hui'], 404);
    }

    // Mise à jour du pointage
    $pointage->update($validatedData);

    return response()->json($pointage);
}


    // Rejeter un pointage
    public function reject(Request $request)
    {
        $validatedData = $request->validate([
            'carte_id' => 'required|string',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'statut' => 'required|in:rejeter',
        ]);

        $validatedData['heure_arrivee'] = null;
        $validatedData['heure_depart'] = null;
        $validatedData['date_actuelle'] = Carbon::now()->toDateString();

        $pointage = Pointage::create($validatedData);

        return response()->json($pointage, 201);
    }
    
}
