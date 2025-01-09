<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Services\JwtService;
use App\Models\HistoricPointage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class UtilisateurController extends Controller
{
    protected $jwtService;

    // Injection du service JwtService via le constructeur
    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    // Afficher tous les utilisateurs
    public function index()
    {
        return Utilisateur::all();
    }

    public function getUtilisateurByCardId($cardId)
    {
        $utilisateur = Utilisateur::where('card_id', $cardId)->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Carte ID non trouvée'], 404);
        }

        return response()->json(['utilisateur' => $utilisateur], 200);
    }

    // Méthode pour enregistrer l'historique des actions
    protected function recordHistory($action, $detail)
    {
        HistoricPointage::create([
            'utilisateur_id' => Auth::id(), // Enregistre l'ID de l'utilisateur authentifié
            'action' => $action,
            'detail' => $detail,
            'created_at' => Carbon::now(), // Enregistre la date de l'action
        ]);
    }

    public function loginByCardId(Request $request)
    {
        $request->validate([
            'card_id' => 'required|string',
        ]);

        Log::info('Card ID reçu : ' . $request->card_id);

        $utilisateur = Utilisateur::where('card_id', $request->card_id)->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Carte ID non trouvée'], 404);
        }

        // Vérification du statut
        if ($utilisateur->status === 'bloqué') {
            return response()->json(['message' => 'Compte bloqué. Veuillez contacter l\'administration.'], 403);
        }

        $payload = [
            'id' => $utilisateur->id,
            'email' => $utilisateur->email,
            'fonction' => $utilisateur->fonction,
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        $jwt = $this->jwtService->generateToken($payload);

        return response()->json([
            'message' => 'Connexion réussie avec la carte',
            'utilisateur' => $utilisateur,
            'token' => $jwt,
        ]);
    }

    public function checkEmailExists($email)
    {
        $exists = Utilisateur::where('email', $email)->exists();
        return response()->json(['exists' => $exists]);
    }

    public function checkTelephoneExists($telephone)
    {
        $exists = Utilisateur::where('telephone', $telephone)->exists();
        return response()->json(['exists' => $exists]);
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

        // Vérification du statut
        if ($utilisateur->status === 'bloqué') {
            return response()->json(['message' => 'Compte bloqué. Veuillez contacter l\'administration.'], 403);
        }

        $payload = [
            'id' => $utilisateur->id,
            'email' => $utilisateur->email,
            'role' => $utilisateur->fonction,
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        $jwt = $this->jwtService->generateToken($payload);

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $utilisateur,
            'token' => $jwt,
        ]);
    }

    public function logout(Request $request)
    {
        // Effacer le token JWT du client (par exemple via les headers ou cookies)
        $request->headers->set('Authorization', ''); // Réinitialiser l'en-tête Authorization

        return response()->json(['message' => 'Déconnexion réussie'], 200);
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
                'card_id' => 'nullable|string',
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

            // Enregistrer l'historique
            $this->recordHistory('Création d\'un utilisateur', 'Utilisateur créé avec ID: ' . $utilisateur->id);

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
            'card_id' => 'nullable|string',
        ]);

        $data = $request->all();

        if (!empty($request->mot_de_passe)) {
            $data['mot_de_passe'] = bcrypt($request->mot_de_passe);
        }

        $utilisateur->update($data);

        // Enregistrer l'historique
        $this->recordHistory('Mise à jour d\'un utilisateur', 'Utilisateur mis à jour avec ID: ' . $utilisateur->id);

        return response()->json($utilisateur);
    }

    // Supprimer un utilisateur spécifique
    public function destroy($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->delete();

        // Enregistrer l'historique
        $this->recordHistory('Suppression d\'un utilisateur', 'Utilisateur supprimé avec ID: ' . $id);

        return response()->json(['message' => 'Utilisateur supprimé avec succès.'], 204);
    }

    // Méthode pour bloquer un utilisateur
    public function bloquer($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['status' => 'bloqué']);

        // Enregistrer l'historique
        $this->recordHistory('Blocage d\'un utilisateur', 'Utilisateur bloqué avec ID: ' . $id);

        return response()->json(['message' => 'Utilisateur bloqué avec succès.']);
    }

    // Méthode pour réactiver un utilisateur
    public function reactiver($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['status' => 'actif']);

        // Enregistrer l'historique
        $this->recordHistory('Réactivation d\'un utilisateur', 'Utilisateur réactivé avec ID: ' . $id);

        return response()->json(['message' => 'Utilisateur réactivé avec succès.']);
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

    public function getListeApprenantsByCohorte($cohorte)
    {
        $apprenants = Utilisateur::where('fonction', 'apprenant')
                                 ->where('cohorte', $cohorte)
                                 ->get();

        if ($apprenants->isEmpty()) {
            return response()->json(['message' => 'Aucun apprenant trouvé pour cette cohorte'], 404);
        }

        return response()->json($apprenants, 200);
    }

    public function getApprenantsByCohorte($cohorte)
    {
        $apprenants = Utilisateur::where('fonction', 'apprenant')
                                 ->where('cohorte', $cohorte)
                                 ->count();

        return response()->json(['cohorte' => $cohorte, 'nombre_apprenants' => $apprenants], 200);
    }

    public function checkCardIdExists($cardId)
    {
        $exists = Utilisateur::where('card_id', $cardId)->exists();
        return response()->json(['exists' => $exists]);
    }

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
        $utilisateur = Utilisateur::find($request->user_id);
        $utilisateur->card_id = $request->card_id;
        $utilisateur->save();

        return response()->json(['message' => 'Carte assignée avec succès'], 200);
    }

    public function countEmployers()
    {
        $count = Utilisateur::where('fonction', 'employer')->count();

        return response()->json(['nombre_employers' => $count], 200);
    }



    public function reactiverMultiple(Request $request)
{
    $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:utilisateurs,id', // Vérifie que chaque ID existe dans la table 'utilisateurs'
    ]);

    // Mettre à jour le statut de tous les utilisateurs spécifiés
    Utilisateur::whereIn('id', $request->ids)->update(['status' => 'actif']);

    return response()->json(['message' => 'Utilisateurs réactivés avec succès.'], 200);
}


    public function destroyMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:utilisateurs,id', // Vérifie que chaque ID existe dans la table 'utilisateurs'
        ]);

        // Supprime les utilisateurs spécifiés par leurs IDs
        Utilisateur::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => 'Utilisateurs supprimés avec succès.'], 200);
    }


    // Modifier un utilisateur
    public function modifier(Request $request, $id)
    {
        return $this->update($request, $id); // Réutilise la méthode "update"
    }




}
