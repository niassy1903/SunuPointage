<?php

namespace App\Http\Controllers;

use App\Models\HistoricPointage;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class HistoricPointageController extends Controller
{
    /**
     * Liste des actions historiques
     */
    public function index()
    {
        $historicPointages = HistoricPointage::with('utilisateur')->orderBy('created_at', 'desc')->get();
        return response()->json($historicPointages);
    }

    /**
     * Ajouter une action dans l'historique
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,_id',
            'action' => 'required|string|max:255',
            'detail' => 'nullable|string|max:1000',
        ]);

        $historicPointage = HistoricPointage::create([
            'utilisateur_id' => $validatedData['utilisateur_id'],
            'action' => $validatedData['action'],
            'detail' => $validatedData['detail'] ?? null,
        ]);

        return response()->json(['message' => 'Action enregistrée avec succès', 'data' => $historicPointage], 201);
    }

    /**
     * Détails d'une action historique
     */
    public function show($id)
    {
        $historicPointage = HistoricPointage::with('utilisateur')->find($id);

        if (!$historicPointage) {
            return response()->json(['message' => 'Action non trouvée'], 404);
        }

        return response()->json($historicPointage);
    }

    /**
     * Modifier une action historique
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'action' => 'required|string|max:255',
            'detail' => 'nullable|string|max:1000',
        ]);

        $historicPointage = HistoricPointage::find($id);

        if (!$historicPointage) {
            return response()->json(['message' => 'Action non trouvée'], 404);
        }

        $historicPointage->update($validatedData);

        return response()->json(['message' => 'Action mise à jour avec succès', 'data' => $historicPointage]);
    }

    /**
     * Supprimer une action historique
     */
    public function destroy($id)
    {
        $historicPointage = HistoricPointage::find($id);

        if (!$historicPointage) {
            return response()->json(['message' => 'Action non trouvée'], 404);
        }

        $historicPointage->delete();

        return response()->json(['message' => 'Action supprimée avec succès']);
    }
}
