<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PasswordReset;
use App\Models\Utilisateur;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Notifications\ResetPasswordNotification; 

class ForgotPasswordController extends Controller
{
    //Envoie du modification password
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:utilisateurs,email',
        ]);
    
        // Récupérer l'utilisateur correspondant à l'e-mail
        $user = Utilisateur::where('email', $request->email)->first();
    
        // Générer le token de réinitialisation
        $token = Password::createToken($user);
    
        $resetRecord = new PasswordReset();
        $resetRecord->email = $request->email;
        $resetRecord->token = $token;
        $resetRecord->save();
    
        // Construire l'URL du lien de réinitialisation avec le token
        $resetUrl = 'http://localhost:4200/reset-password?token=' . $token . '&email=' . urlencode($request->email);
    
        // Envoyer la notification avec l'URL
        $user->notify(new ResetPasswordNotification($token, $request->email));
    
        return response()->json(['message' => 'Lien de réinitialisation envoyé.'], 200);
    }
    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:utilisateurs,email',
            'password' => 'required|confirmed|min:8',
        ]);
    
        // Vérifier si le token existe dans la collection password_resets
        $resetRecord = PasswordReset::where('email', $request->email)
                                    ->where('token', $request->token)
                                    ->first();
    
        if (!$resetRecord) {
            return response()->json(['message' => 'Token de réinitialisation invalide ou expiré.'], 400);
        }
    
        // Récupérer l'utilisateur correspondant à l'email
        $user = Utilisateur::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }
    
        // Mettre à jour le mot de passe de l'utilisateur
        $user->password = $request->password; // Le setter `setMotDePasseAttribute` hachera automatiquement le mot de passe
        $user->save();  // Sauvegarder l'utilisateur mis à jour
    
        // Supprimer le token de la collection password_resets
        $resetRecord->delete();
    
        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.'], 200);
    }
    
}
