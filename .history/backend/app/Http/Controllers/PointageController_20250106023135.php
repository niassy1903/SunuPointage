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
    public function getTotalPointages($date)
    {
        // Convertir la date au bon format si nécessaire
        $date = Carbon::parse($date)->toDateString();
        $totalPointages = Pointage::whereDate('date_actuelle', $date)->count();
    
        return response()->json(['date' => $date, 'total_pointages' => $totalPointages]);
    }
    
    public function getTotalValidations($date)
    {
        // Convertir la date au bon format si nécessaire
        $date = Carbon::parse($date)->toDateString();
        $totalValidations = Pointage::whereDate('date_actuelle', $date)
            ->where('validation', 'validée')
            ->count();
    
        return response()->json(['date' => $date, 'total_validations' => $totalValidations]);
    }
    
    public function getTotalRejets($date)
    {
        // Convertir la date au bon format si nécessaire
        $date = Carbon::parse($date)->toDateString();
        $totalRejets = Pointage::whereDate('date_actuelle', $date)
            ->where('validation', 'rejetée')
            ->count();
    
        return response()->json(['date' => $date, 'total_rejets' => $totalRejets]);
    }

    
    public function getStatistiquesPointages($date)
{
    $pointages = Pointage::whereDate('date_actuelle', $date)->get();

    $statistiques = [
        'total_employes' => $pointages->count(),
        'present' => 0,
        'retard' => 0,
        'absent' => 0,
        'depart_anticipé' => 0,
        'depart_tardif' => 0,
    ];

    foreach ($pointages as $pointage) {
        $heureArrivee = $pointage->heure_arrivee;
        $heureDepart = $pointage->heure_depart;

        if (!$heureArrivee) {
            $statistiques['absent']++;
        } elseif ($heureArrivee > '08:30') {
            $statistiques['retard']++;
        } elseif ($heureDepart && $heureDepart < '17:00') {
            $statistiques['depart_anticipé']++;
        } elseif ($heureDepart && $heureDepart > '17:00') {
            $statistiques['depart_tardif']++;
        } else {
            $statistiques['present']++;
        }
    }

    return response()->json($statistiques);
}

}
