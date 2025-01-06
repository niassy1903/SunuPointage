<?php
namespace App\Http\Controllers;

use App\Models\Pointage;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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
            return response()->json(['error' => 'Un pointage existe déjà pour cette carte aujourd\'hui'], 400);
        } else {
            if (!isset($validatedData['heure_arrivee'])) {
                return response()->json(['error' => 'Heure d\'arrivée requise pour un nouveau pointage'], 400);
            }

            $validatedData['date_actuelle'] = $today;
            $validatedData['heure_depart'] = null;
            $pointage = Pointage::create($validatedData);

            return response()->json($pointage, 201);
        }
    }

    // Fonction pour obtenir un pointage par carte_id
    public function getPointageByCardId($cardId)
    {
        $today = Carbon::today()->toDateString();

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
            'heure_depart' => 'nullable|date_format:H:i',
        ]);

        $pointage = Pointage::findOrFail($id);
        $pointage->update($validatedData);

        return response()->json($pointage);
    }

    // Récupérer le total des pointages par jour

    public function getTotalPointages(Request $request)
    {
        // Obtenir la date d'aujourd'hui au format 'YYYY-MM-DD' (sans l'heure)
        $date = $request->input('date', Carbon::today()->toDateString());
    
        // Convertir la date en début de journée (00:00:00)
        $startOfDay = Carbon::parse($date)->startOfDay();
        $endOfDay = Carbon::parse($date)->endOfDay();
    
        // Effectuer la recherche dans MongoDB pour les pointages entre le début et la fin de la journée
        $totalPointages = Pointage::whereBetween('date_actuelle', [$startOfDay, $endOfDay])->count();
    
        return response()->json(['date' => $date, 'total_pointages' => $totalPointages]);
    }
    

    // Récupérer le total des pointages validés par jour
    public function getTotalValidations(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $totalValidations = Pointage::whereDate('date_actuelle', $date)
            ->where('validation', 'validée')
            ->count();

        return response()->json(['date' => $date, 'total_validations' => $totalValidations]);
    }

    // Récupérer le total des pointages rejetés par jour
    public function getTotalRejets(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $totalRejets = Pointage::whereDate('date_actuelle', $date)
            ->where('validation', 'rejetée')
            ->count();

        return response()->json(['date' => $date, 'total_rejets' => $totalRejets]);
    }
}
