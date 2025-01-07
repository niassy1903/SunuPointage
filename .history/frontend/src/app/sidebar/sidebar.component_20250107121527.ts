import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule],
  providers: [UtilisateurService]
})
export class SidebarComponent implements OnInit {
  userRole: string = ''; // Propriété pour stocker le rôle de l'utilisateur

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.checkUserRole(); // Vérifier le rôle de l'utilisateur lors de l'initialisation
  }

  // Fonction pour récupérer et vérifier le rôle de l'utilisateur
  checkUserRole() {
    const utilisateur = JSON.parse(localStorage.getItem('user') || '{}');
    if (utilisateur && utilisateur.fonction) {
      this.userRole = utilisateur.fonction; // Récupérer le rôle de l'utilisateur
    } else {
      // Si l'utilisateur n'est pas trouvé, peut-être rediriger vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

  logout() {
    // Appel du service pour se déconnecter
    this.utilisateurService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion après la déconnexion
    });
  }
}
