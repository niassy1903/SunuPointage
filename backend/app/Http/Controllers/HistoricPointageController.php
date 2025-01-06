<?php

namespace App\Http\Controllers;

use App\Models\HistoricPointage;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoricPointageController extends Controller
{
    // Afficher tous les historiques
    public function index()
    {
        $historics = HistoricPointage::with('utilisateur')->get();

        return response()->json([
            'message' => 'Historics fetched successfully',
            'data' => $historics,
        ]);
    }

    // Créer un nouvel historique
    public function store(Request $request)
    {
        $request->validate([
            'action' => 'required|string|max:255',
            'detail' => 'nullable|string',
        ]);

        $historic = HistoricPointage::create([
            'utilisateur_id' => Auth::id(), // ID de l'utilisateur connecté
            'action' => $request->input('action'),
            'detail' => $request->input('detail'),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Historic created successfully',
            'data' => $historic,
        ]);
    }

    // Afficher un historique spécifique
    public function show($id)
    {
        $historic = HistoricPointage::with('utilisateur')->find($id);

        if (!$historic) {
            return response()->json(['message' => 'Historic not found'], 404);
        }

        return response()->json($historic);
    }

    // Mettre à jour un historique
    public function update(Request $request, $id)
    {
        $historic = HistoricPointage::find($id);

        if (!$historic) {
            return response()->json(['message' => 'Historic not found'], 404);
        }

        $request->validate([
            'action' => 'required|string|max:255',
            'detail' => 'nullable|string',
        ]);

        $historic->update([
            'action' => $request->input('action'),
            'detail' => $request->input('detail'),
        ]);

        return response()->json([
            'message' => 'Historic updated successfully',
            'data' => $historic,
        ]);
    }

    // Supprimer un historique
    public function destroy($id)
    {
        $historic = HistoricPointage::find($id);

        if (!$historic) {
            return response()->json(['message' => 'Historic not found'], 404);
        }

        $historic->delete();

        return response()->json(['message' => 'Historic deleted successfully']);
    }
}
