import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service'; // Assurez-vous du bon chemin d'importation

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Corrigé de styleUrl à styleUrls
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule],
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService // Injection du service UtilisateurService
  ) {}

  logout() {
    // Appel du service pour se déconnecter
    this.utilisateurService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion après la déconnexion
    });
  }
}
