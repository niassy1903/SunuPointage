<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    private $resetUrl; // Déclaration de la propriété pour l'URL de réinitialisation
    private $token;
    private $email;

    /**
     * Create a new notification instance.
     *
     * @param string $token
     * @param string $email
     */
    public function __construct(string $token, string $email)
    {
        $this->token = $token; // Initialisation du token
        $this->email = $email; // Initialisation de l'email
        $this->resetUrl = 'http://localhost:4200/reset-password?token=' . $token . '&email=' . urlencode($email); // Générer l'URL avec le token et l'email
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Réinitialisation de mot de passe')
            ->line('Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.')
            ->action('Réinitialiser le mot de passe', $this->resetUrl) // Utilisation de la propriété $resetUrl
            ->line('Si vous n\'avez pas demandé de réinitialisation, aucune action supplémentaire n\'est requise.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'token' => $this->token, // Vous pouvez l'inclure ici si nécessaire
        ];
    }
}
