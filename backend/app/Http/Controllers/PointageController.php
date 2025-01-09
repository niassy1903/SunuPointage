<?php
namespace App\Http\Controllers;

use App\Models\Pointage;
use App\Http\Controllers\HistoricPointageController;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PointageController extends Controller
{
    protected $historicController;

    public function __construct(HistoricPointageController $historicController)
    {
        $this->historicController = $historicController;
    }

    // Afficher tous les pointages
    public function index()
    {
        $pointages = Pointage::all();

        // Enregistrer l'historique pour la consultation des pointages
        $this->historicController->store(new Request([
            'action' => 'Consultation des pointages',
            'detail' => 'Affichage de la liste complète des pointages',
        ]));

        return response()->json($pointages);
    }

    // Afficher un pointage spécifique
    public function show($id)
    {
        $pointage = Pointage::findOrFail($id);

        // Enregistrer l'historique pour la consultation d'un pointage spécifique
        $this->historicController->store(new Request([
            'action' => 'Consultation d\'un pointage',
            'detail' => 'Affichage du pointage avec ID: ' . $id,
        ]));

        return response()->json($pointage);
    }

    // Créer un pointage
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

        // Enregistrer l'historique pour la création du pointage
        $this->historicController->store(new Request([
            'action' => 'Création d\'un pointage',
            'detail' => 'Création d\'un pointage pour la carte ID: ' . $validatedData['carte_id'],
        ]));

        return response()->json($pointage, 201);
    }

    // Créer plusieurs pointages
    public function createPointage(Request $request)
    {
        $validatedData = $request->validate([
            '*.carte_id' => 'required|string',
            '*.nom' => 'required|string',
            '*.prenom' => 'required|string',
            '*.heure_arrivee' => 'nullable|date_format:H:i',  // Heure d'arrivée non obligatoire
            '*.heure_depart' => 'nullable|date_format:H:i',
            '*.statut' => 'nullable|in:present,absent,malade,conge,retard,rejeter', // Validation des statuts
        ]);

        $today = Carbon::now()->toDateString();
        $createdPointages = [];

        foreach ($validatedData as $data) {
            // Recherche d'un pointage existant pour la même carte le même jour
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
            $data['heure_depart'] = $data['heure_depart'] ?? null;  // Mettre l'heure de départ à null si elle n'est pas définie
            $pointage = Pointage::create($data);

            // Enregistrer l'historique pour la création de chaque pointage
            $this->historicController->store(new Request([
                'action' => 'Création d\'un pointage',
                'detail' => 'Création d\'un pointage pour la carte ID: ' . $data['carte_id'],
            ]));

            $createdPointages[] = $pointage;
        }

        return response()->json($createdPointages, 201);
    }

    // Mettre à jour un pointage existant
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

        // Enregistrer l'historique pour la mise à jour du pointage
        $this->historicController->store(new Request([
            'action' => 'Mise à jour d\'un pointage',
            'detail' => 'Mise à jour du pointage pour la carte ID: ' . $carte_id,
        ]));

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
            'heure_depart' => 'nullable|date_format:H:i',
        ]);

        $validatedData['heure_arrivee'] = null;
        $validatedData['heure_depart'] = null;
        $validatedData['date_actuelle'] = Carbon::now()->toDateString();

        $pointage = Pointage::create($validatedData);

        // Enregistrer l'historique pour le rejet du pointage
        $this->historicController->store(new Request([
            'action' => 'Rejet d\'un pointage',
            'detail' => 'Rejet du pointage pour la carte ID: ' . $validatedData['carte_id'],
        ]));

        return response()->json($pointage, 201);
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
    
    // Compter les validations avec statut "Présent" ou "Retard"
    $totalValidations = Pointage::whereDate('date_actuelle', $date)
        ->whereIn('statut', ['present', 'retard']) // Inclure "Présent" et "Retard"
        ->count();
    
    return response()->json([
        'date' => $date,
        'total_validations' => $totalValidations
    ]);
}

    public function getTotalRejets($date)
    {
        // Convertir la date au bon format si nécessaire
        $date = Carbon::parse($date)->toDateString();
        $totalRejets = Pointage::whereDate('date_actuelle', $date)
            ->where('statut', 'rejeter')
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

// Méthode pour compter les présences par jour
public function getDailyPresenceCount($date)
{
    // S'assurer que la date est bien au format ISO 8601
    $date = Carbon::parse($date)->toDateString(); // Convertir la date en 'YYYY-MM-DD'

    // Récupérer le nombre de présences pour la date donnée et statut 'présent'
    $dailyPresenceCount = Pointage::whereDate('date_actuelle', $date)
        ->where('statut', 'present') // Filtrer les présences avec le statut 'present'
        ->count();

    // Retourner la réponse JSON avec la date et le nombre de présences
    return response()->json([
        'date' => $date,
        'daily_presence_count' => $dailyPresenceCount,
    ]);
}
}
