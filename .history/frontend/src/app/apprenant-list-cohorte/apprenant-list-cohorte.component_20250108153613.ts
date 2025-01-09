import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
declare var bootstrap : any;

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
  selectedApprenant: any = null;
  actionType: 'delete' | 'edit' = 'delete';

  constructor(private route: ActivatedRoute, private utilisateurService: UtilisateurService) {}

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

  // Ouvre le modal de confirmation pour supprimer un apprenant
  openDeleteConfirmation(apprenant: any) {
    this.selectedApprenant = apprenant;
    this.actionType = 'delete';
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal')!);
    modal.show();
  }

  // Ouvre le modal de confirmation pour modifier un apprenant
  openEditConfirmation(apprenant: any) {
    this.selectedApprenant = apprenant;
    this.actionType = 'edit';
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal')!);
    modal.show();
  }

  // Confirme l'action (supprimer ou modifier)
  confirmAction(): void { 
    if (this.actionType === 'delete') {
      this.deleteApprenant();
    } else if (this.actionType === 'edit') {
      this.editApprenant();
    }
  }

  // Supprime l'apprenant sélectionné
  deleteApprenant() {
    if (this.selectedApprenant) {
      this.utilisateurService.deleteUtilisateur(this.selectedApprenant.id).subscribe({
        next: () => {
          // Récupérer l'élément modal
          const modalElement = document.getElementById('confirmationModal');
          
          if (modalElement) {
            // Si l'élément modal existe, récupérez l'instance et fermez-le
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            } else {
              console.error('Erreur : L\'instance du modal n\'a pas pu être récupérée.');
            }
          } else {
            console.error('Erreur : L\'élément modal n\'a pas été trouvé.');
          }
          // Recharger la liste des apprenants après la suppression
          this.loadApprenants(this.cohorteName);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'apprenant:', err);
        }
      });
    }
  }
  

  // Modifie l'apprenant sélectionné (logique à définir)
  editApprenant() {
    // Afficher l'apprenant sélectionné dans la console pour l'édition
    console.log('Modification de l\'apprenant:', this.selectedApprenant);
  
    // Récupérer l'élément modal
    const modalElement = document.getElementById('confirmationModal');
    
    if (modalElement) {
      // Si l'élément modal existe, récupérer l'instance du modal
      const modal = bootstrap.Modal.getInstance(modalElement);
      
      if (modal) {
        // Si l'instance du modal a été correctement récupérée, le fermer
        modal.hide();
      } else {
        console.error('Erreur : L\'instance du modal n\'a pas pu être récupérée.');
      }
    } else {
      console.error('Erreur : L\'élément modal n\'a pas été trouvé.');
    }
  
    // Vous pouvez ajouter ici la logique pour l'édition de l'apprenant, par exemple, ouvrir un formulaire d'édition.
    // console.log('Logiciel pour modifier l\'apprenant:', this.selectedApprenant);
  }
  
}
