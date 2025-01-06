import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [UtilisateurService]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  cardId: string = '';
  passwordVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showCardInput: boolean = false;
  ws!: WebSocket;

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'cardRead') {
        this.cardId = data.cardId;
        this.showCardInput = true;
        this.confirmCardLogin();
      }
    };
  }

  confirmCardLogin() {
    this.utilisateurService.loginByCardId(this.cardId).subscribe(
      response => {
        console.log('Login successful', response);
        if (response.utilisateur.fonction === 'admin') {
          this.successMessage = 'Connexion réussie';
          this.showSuccessModal(() => {
            this.redirectBasedOnRole(response.utilisateur);
          });
        } else {
          this.errorMessage = 'Accès non autorisé';
          this.showUnauthorizedModal();
        }
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 404) {
          this.errorMessage = 'Carte ID non trouvée';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    );
  }

  onSubmit() {
    this.utilisateurService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.successMessage = 'Connexion réussie';
        this.showSuccessModal(() => {
          this.redirectBasedOnRole(response.utilisateur);
        });
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    );
  }

  showSuccessModal(onConfirm: () => void) {
    const modalElement = document.getElementById('loginSuccessModal');
    const modal = new bootstrap.Modal(modalElement!);

    // Affiche le modal
    modal.show();

    // Ajout d'un écouteur pour le bouton "OK"
    const confirmButton = document.getElementById('confirmRedirect');
    confirmButton?.addEventListener(
      'click',
      () => {
        // Ferme le modal
        modal.hide();

        // Redirection après fermeture complète du modal
        modalElement?.addEventListener(
          'hidden.bs.modal',
          () => {
            onConfirm();
          },
          { once: true } // Ajout pour éviter d'exécuter plusieurs fois
        );
      },
      { once: true }
    );
  }

  showUnauthorizedModal() {
    const modalElement = document.getElementById('unauthorizedModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();

    // Ajout d'un écouteur pour le bouton "OK" et "Close"
    const confirmButton = document.getElementById('confirmRedirectUnauthorized');
    confirmButton?.addEventListener(
      'click',
      () => {
        // Ferme le modal
        modal.hide();

        // Redirection après fermeture complète du modal
        modalElement?.addEventListener(
          'hidden.bs.modal',
          () => {
            this.showCardInput = false;
          },
          { once: true } // Ajout pour éviter d'exécuter plusieurs fois
        );
      },
      { once: true }
    );

    const closeButton = modalElement?.querySelector('.btn-close');
    closeButton?.addEventListener(
      'click',
      () => {
        // Ferme le modal
        modal.hide();

        // Redirection après fermeture complète du modal
        modalElement?.addEventListener(
          'hidden.bs.modal',
          () => {
            this.showCardInput = false;
          },
          { once: true } // Ajout pour éviter d'exécuter plusieurs fois
        );
      },
      { once: true }
    );
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  redirectBasedOnRole(utilisateur: any) {
    if (utilisateur.fonction === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (utilisateur.fonction === 'vigile') {
      this.router.navigate(['/dashboard-vigile']);
    }
  }
}
