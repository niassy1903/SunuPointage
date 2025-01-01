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
        $validatedData = $request->validate([
            'carte_id' => 'required|string',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'heure_arrivee' => 'nullable|date_format:H:i',
            'heure_depart' => 'nullable|date_format:H:i',
            'statut' => 'nullable|in:present,absent,malade,conge,retard',
        ]);

        $today = Carbon::now()->toDateString();

        $existingPointage = Pointage::where('carte_id', $validatedData['carte_id'])
            ->where('date_actuelle', $today)
            ->first();

        if ($existingPointage) {
            // Si un pointage existe déjà, retourner une erreur
            return response()->json(['error' => 'Un pointage existe déjà pour cette carte aujourd\'hui'], 400);
        } else {
            // Créer un nouveau pointage
            if (!isset($validatedData['heure_arrivee'])) {
                return response()->json(['error' => 'Heure d\'arrivée requise pour un nouveau pointage'], 400);
            }

            $validatedData['date_actuelle'] = $today;
            $validatedData['heure_depart'] = null; // Définir explicitement heure_depart comme null
            $pointage = Pointage::create($validatedData);

            return response()->json($pointage, 201);
        }
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

    // Mettre à jour un pointage existant
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'heure_depart' => 'nullable|date_format:H:i', // Champ facultatif
        ]);

        $pointage = Pointage::findOrFail($id);
        $pointage->update($validatedData);

        return response()->json($pointage);
    }
}
