<?php

namespace App\Http\Controllers;

use App\Models\Cohorte;
use App\Models\Utilisateur; // Assurez-vous d'importer le modèle Utilisateur
use Illuminate\Http\Request;

class CohorteController extends Controller
{
    public function index()
    {
        return Cohorte::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'annee_creation' => 'required|date',
            'description' => 'nullable',
        ]);

        return Cohorte::create($request->all());
    }

    public function show($id)
    {
        return Cohorte::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cohorte = Cohorte::findOrFail($id);

        // Validation conditionnelle des champs
        $request->validate([
            'nom' => 'sometimes|required',
            'annee_creation' => 'sometimes|required|date',
            'description' => 'nullable',
        ]);

        // Mise à jour uniquement des champs présents dans la requête
        $cohorte->update($request->only(['nom', 'annee_creation', 'description']));

        return response()->json($cohorte, 200);
    }

    public function destroy($id)
    {
        $cohorte = Cohorte::findOrFail($id);

        // Vérifiez si la cohorte a des utilisateurs avec la fonction "apprenant"
        $apprenants = Utilisateur::where('cohorte', $cohorte->nom)
                                 ->where('fonction', 'apprenant')
                                 ->get();

        // Suppression des apprenants associés
        if ($apprenants->isNotEmpty()) {
            foreach ($apprenants as $apprenant) {
                $apprenant->delete();
            }


        }

        // Suppression de la cohorte
        $cohorte->delete();

        return response()->json(null, 204);  // Suppression réussie sans contenu
    }

    public function checkExistence($id)
{
    // Vérifier si la cohorte existe
    $exists = Cohorte::where('id', $id)->exists();

    // Retourner une réponse JSON
    if ($exists) {
        return response()->json(['message' => 'La cohorte existe.', 'exists' => true], 200);
    } else {
        return response()->json(['message' => 'La cohorte n\'existe pas.', 'exists' => false], 404);
    }
}


}

