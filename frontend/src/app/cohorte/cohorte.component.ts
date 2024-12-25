import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CohorteService } from '../cohorte.service'; // Service des cohortes
import { UtilisateurService } from '../utilisateur.service'; // Service des utilisateurs

interface Cohorte {
  name: string;
  description: string;
  capacity: number; // La capacité sera calculée à partir de l'API
}

@Component({
  selector: 'app-cohorte',
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, NavbarComponent, HttpClientModule],
  providers: [CohorteService, UtilisateurService], // Ajouter les deux services ici
})
export class CohorteComponent implements OnInit {
  cohortes: Cohorte[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(
    private cohorteService: CohorteService, // Service des cohortes
    private utilisateurService: UtilisateurService // Service des utilisateurs
  ) {}

  ngOnInit() {
    this.loadCohortes();
  }

 loadCohortes() {
  this.cohorteService.getCohortes().subscribe({
    next: (data) => {
      // Créer un tableau de promesses pour les appels API
      const promises = data.map(cohorte => 
        new Promise<Cohorte>(resolve => {
          this.utilisateurService.getApprenantsByCohorte(cohorte.nom).subscribe({
            next: (apprenantsData) => {
              resolve({
                name: cohorte.nom,
                description: cohorte.description,
                capacity: apprenantsData.nombre_apprenants
              });
            },
            error: () => {
              resolve({
                name: cohorte.name,
                description: cohorte.description,
                capacity: 0
              });
            }
          });
        })
      );

      // Attendre que toutes les promesses soient résolues
      Promise.all(promises).then(cohortes => {
        this.cohortes = cohortes;
        this.totalPages = Math.ceil(this.cohortes.length / this.itemsPerPage);
      });
    },
    error: (err) => {
      console.error('Erreur:', err);
    }
  });
}

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  addCohorte() {
    console.log('Ajouter une cohorte - À implémenter');
  }

  editCohorte(cohorte: Cohorte) {
    console.log('Éditer une cohorte - À implémenter');
  }

  deleteCohorte(cohorte: Cohorte) {
    console.log('Supprimer une cohorte - À implémenter');
  }

  exportCSV() {
    console.log('Exporter en CSV - À implémenter');
  }

  getPaginatedCohortes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.cohortes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  generatePageArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}
