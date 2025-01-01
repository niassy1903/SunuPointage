<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UtilisateurController extends Controller
{
    // Afficher tous les utilisateurs
    public function index()
    {
        return Utilisateur::all();
    }

    public function loginByCardId(Request $request)
    {
        Log::info('Card ID reçu : ' . $request->card_id);

        // Recherche de l'utilisateur avec le card_id dans la collection MongoDB
        $utilisateur = Utilisateur::where('card_id', $request->card_id)->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Carte ID non trouvée'], 404);
        }

        return response()->json(['message' => 'connexion réussie', 'utilisateur' => $utilisateur]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required',
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        if (!in_array($utilisateur->fonction, ['admin','vigile'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json(['message' => 'Login successful', 'utilisateur' => $utilisateur]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required',
                'prenom' => 'required',
                'email' => 'required|email|unique:utilisateurs',
                'adresse' => 'required',
                'telephone' => 'required',
                'fonction' => 'required|in:apprenant,vigile,admin,employer',
                'photo' => 'nullable',
                'departement' => 'nullable|string',
                'cohorte' => 'nullable|string',
                'mot_de_passe' => 'nullable|min:6|same:confirm_mot_de_passe',
                'confirm_mot_de_passe' => 'nullable|min:6',
                'card_id' => 'nullable|string', // Ajout du champ card_id
            ]);

            // Vérification de l'unicité de card_id
            $cardIdExists = Utilisateur::where('card_id', $request->card_id)->exists();
            if ($cardIdExists) {
                return response()->json(['message' => 'Card ID already exists'], 409);
            }

            $matricule = $this->generateMatricule();

            $data = $request->all();
            $data['matricule'] = $matricule;

            // Création de l'utilisateur
            $utilisateur = Utilisateur::create($data);

            return response()->json(['message' => 'Utilisateur créé avec succès.', 'utilisateur' => $utilisateur], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la création de l\'utilisateur.', 'error' => $e->getMessage()], 500);
        }
    }

    protected function generateMatricule()
    {
        $year = date('Y');
        $lastUser = Utilisateur::latest()->first();

        $number = $lastUser ? (int)substr($lastUser->matricule, -3) : 0;
        $number++;

        return "MATRICULE-{$year}-" . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    // Afficher un utilisateur spécifique
    public function show($id)
    {
        return Utilisateur::findOrFail($id);
    }

    // Mettre à jour un utilisateur spécifique
    public function update(Request $request, $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|required',
            'prenom' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:utilisateurs,email,' . $id,
            'adresse' => 'sometimes|required',
            'telephone' => 'sometimes|required',
            'fonction' => 'sometimes|required|in:apprenant,vigile,admin,employer',
            'photo' => 'nullable',
            'departement' => 'nullable|string',
            'cohorte' => 'nullable|string',
            'mot_de_passe' => 'nullable|min:6|same:confirm_mot_de_passe',
            'confirm_mot_de_passe' => 'nullable|min:6',
            'card_id' => 'nullable|string', // Ajout du champ card_id
        ]);

        $data = $request->all();

        if (!empty($request->mot_de_passe)) {
            $data['mot_de_passe'] = bcrypt($request->mot_de_passe);
        }

        $utilisateur->update($data);

        return $utilisateur;
    }

    // Supprimer un utilisateur spécifique
    public function destroy($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.'], 204);
    }

    // Méthode pour bloquer un utilisateur
    public function bloquer($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['status' => 'bloqué']);

        return response()->json(['message' => 'Utilisateur bloqué avec succès.']);
    }

    // Méthode pour réactiver un utilisateur
    public function reactiver($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['status' => 'actif']);

        return response()->json(['message' => 'Utilisateur réactivé avec succès.']);
    }

    // Modifier un utilisateur
    public function modifier(Request $request, $id)
    {
        return $this->update($request, $id); // Réutilise la méthode "update"
    }

    public function getEmployersByDepartment($departement)
    {
        $employers = Utilisateur::where('fonction', 'employer')
                                ->where('departement', $departement)
                                ->get();

        if ($employers->isEmpty()) {
            return response()->json(['message' => 'Aucun employé trouvé pour ce département'], 404);
        }

        return response()->json($employers, 200);
    }

    // Méthode pour obtenir le nombre d'apprenants dans une cohorte spécifique
    public function getApprenantsByCohorte($cohorte)
    {
        $apprenants = Utilisateur::where('fonction', 'apprenant')
                                 ->where('cohorte', $cohorte)
                                 ->count();

        return response()->json(['cohorte' => $cohorte, 'nombre_apprenants' => $apprenants], 200);
    }

    // Ajoutez cette méthode pour vérifier l'existence de la carte
    public function checkCardIdExists($cardId)
    {
        $exists = Utilisateur::where('card_id', $cardId)->exists();
        return response()->json(['exists' => $exists]);
    }

    // Ajoutez cette méthode pour assigner une carte à un utilisateur
    public function assignCard(Request $request)
    {
        $request->validate([
            'card_id' => 'required|string',
        ]);

        $utilisateur = Utilisateur::where('card_id', $request->card_id)->first();

        if ($utilisateur) {
            return response()->json(['message' => 'Carte ID déjà assignée'], 409);
        }

        // Logique pour assigner la carte à un utilisateur
        // Par exemple, vous pouvez mettre à jour l'utilisateur avec le card_id
        $utilisateur = Utilisateur::find($request->user_id);
        $utilisateur->card_id = $request->card_id;
        $utilisateur->save();

        return response()->json(['message' => 'Carte assignée avec succès'], 200);
    }
}
