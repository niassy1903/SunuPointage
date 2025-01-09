import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importation de Router pour la navigation

@Component({
  selector: 'app-apprenant-list-cohorte',
  templateUrl: './apprenant-list-cohorte.component.html',
  styleUrls: ['./apprenant-list-cohorte.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [UtilisateurService],
})
export class ApprenantListCohorteComponent implements OnInit {
  apprenants: any[] = [];
  filteredApprenants: any[] = [];
  paginatedApprenants: any[] = [];
  cohorteName: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService,
    private router: Router  // Ajout du Router pour la navigation
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cohorteName = params['cohorteName'];
      this.loadApprenants(this.cohorteName);
    });
  }

  loadApprenants(cohorteName: string) {
    this.utilisateurService.getListeApprenantsByCohorte(cohorteName).subscribe({
      next: (data) => {
        this.apprenants = data;
        this.filteredApprenants = data;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des apprenants :', err);
      }
    });
  }

  filterApprenants() {
    if (this.searchTerm.trim() === '') {
      this.filteredApprenants = this.apprenants;
    } else {
      this.filteredApprenants = this.apprenants.filter(apprenant =>
        apprenant.matricule.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredApprenants.length / this.itemsPerPage);
    this.changePage(this.currentPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedApprenants = this.filteredApprenants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  generatePageArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  // Méthode pour supprimer un apprenant
  deleteApprenant(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      this.utilisateurService.deleteUtilisateur(id).subscribe({
        next: () => {
          alert('Apprenant supprimé avec succès.');
          this.loadApprenants(this.cohorteName); // Recharger la liste après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'apprenant:', err);
          alert('Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }

  // Méthode pour modifier un apprenant
  editApprenant(id: string) {
    this.router.navigate([`/edit-apprenant/${id}`]); // Redirection vers la page de modification
  }
}
