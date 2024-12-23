import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartementService } from '../departement.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UtilisateurService } from '../utilisateur.service';
import { CohorteService } from '../cohorte.service';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, NavbarComponent,HttpClientModule],
  providers: [UtilisateurService,CohorteService,DepartementService]
})
export class DepartementComponent implements OnInit {
  departments: any[] = []; // Stockage des départements récupérés
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;

  constructor(private departementService: DepartementService) {}

  ngOnInit() {
    this.loadDepartments();
  }

 
  // Fonction pour charger les départements
  loadDepartments() {
    this.departementService.getDepartements().subscribe({
      next: (data) => {
        this.departments = data.map((department) => {
          const currentYear = new Date().getFullYear();
          const nextYear = currentYear + 1;
          return {
            ...department,
            academicYear: `${currentYear}/${nextYear}`, // Année académique dynamique
          };
        });

        this.totalPages = Math.ceil(this.departments.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des départements :', err);
      },
    });
  }

  // Fonction pour changer de page
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // Ajout d'un département (à adapter selon votre logique)
  addDepartment() {
    console.log('Ajouter un département - À implémenter');
  }

  // Exportation des données en CSV (à adapter selon votre logique)
  exportCSV() {
    console.log('Exporter en CSV - À implémenter');
  }

  // Pagination : Obtenir les départements de la page courante
  getPaginatedDepartments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.departments.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
