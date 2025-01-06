<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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

        // Construire l'URL du lien de réinitialisation avec le token
        $resetUrl = url('http://localhost:4200/reset-password?token=' . $token . '&email=' . urlencode($request->email));

        // Envoyer la notification avec l'URL
        $user->notify(new ResetPasswordNotification($resetUrl));

        return response()->json(['message' => 'Lien de réinitialisation envoyé.'], 200);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:utilisateurs,email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Mot de passe réinitialisé.'], 200)
            : response()->json(['message' => 'Erreur de réinitialisation.'], 400);
    }
}
