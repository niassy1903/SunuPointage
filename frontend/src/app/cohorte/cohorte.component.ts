import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CohorteService } from '../cohorte.service'; // Service des cohortes
import { UtilisateurService } from '../utilisateur.service'; // Service des utilisateurs
import { Router } from '@angular/router';

declare var bootstrap: any;

interface Cohorte {
  id: string; // Ajout du champ id en tant que chaîne de caractères
  name: string;
  description: string;
  capacity: number; // La capacité sera calculée à partir de l'API
}

@Component({
  selector: 'app-cohorte',
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [CohorteService, UtilisateurService], // Ajouter les deux services ici
})
export class CohorteComponent implements OnInit {
  cohortes: Cohorte[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  selectedCohorte: any;

  constructor(
    private cohorteService: CohorteService, // Service des cohortes
    private utilisateurService: UtilisateurService, // Service des utilisateurs
    private router: Router,
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
                  id: cohorte.id, // Ajout de l'ID au format ObjectId
                  name: cohorte.nom,
                  description: cohorte.description,
                  capacity: apprenantsData.nombre_apprenants
                });
              },
              error: () => {
                resolve({
                  id: cohorte.id, // Ajout de l'ID au format ObjectId
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
    this.router.navigate(['/add-cohorte'])
  }

  editCohorte(cohorte: any): void {
    if (!cohorte || !cohorte.id) {
      console.error('Cohorte invalide ou ID manquant', cohorte);
      return;
    }
    this.router.navigate(['/edit-cohorte', cohorte.id]);
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

  deleteCohorte(cohorte: any) {
    this.selectedCohorte = cohorte;

    const modalId = cohorte.capacity > 0
      ? 'deleteWithApprenantsModal'
      : 'deleteWithoutApprenantsModal';

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      try {
        const bootstrapModal = new bootstrap.Modal(modalElement, { backdrop: true });
        bootstrapModal.show();
      } catch (error) {
        console.error('Erreur lors de l’ouverture de la modal:', error);
      }
    } else {
      console.error(`Modal ${modalId} non trouvé dans le DOM.`);
    }
  }

  confirmDeleteWithApprenants() {
    this.cohorteService.deleteCohorte(this.selectedCohorte.id).subscribe(
      () => {
        // Fermer le modal
        this.hideModal('deleteWithApprenantsModal');

        // Recharger les cohortes
        this.loadCohortes();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la cohorte', error);
      }
    );
  }

  confirmDeleteWithoutApprenants() {
    this.cohorteService.deleteCohorte(this.selectedCohorte.id).subscribe(
      () => {
        // Fermer le modal
        this.hideModal('deleteWithoutApprenantsModal');

        // Recharger les cohortes
        this.loadCohortes();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la cohorte', error);
      }
    );
  }

  hideModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.setAttribute('style', 'display: none');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  viewCohorte(cohorteName: string) {
    this.router.navigate(['/cohortes', cohorteName, 'apprenants']);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
