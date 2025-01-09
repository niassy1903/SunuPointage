import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HistoricPointageService } from '../historic-pointage.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';  // Importation du module de pagination

// Définition de l'interface Historique
interface Historique {
  firstName: string;
  lastName: string;
  date: string;
  time: string;
  action: string;
  matricule: string; // Ajout du matricule
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgbPaginationModule],  // Ajout du module de pagination de ng-bootstrap
  providers: [HistoricPointageService]
})
export class HistoriqueComponent implements OnInit {
  historiques: Historique[] = [];              // Liste complète des historiques
  filteredHistoriques: Historique[] = [];      // Liste des historiques filtrés
  currentPage: number = 1;                     // Page actuelle de la pagination
  totalPages: number = 1;                      // Total de pages pour la pagination
  itemsPerPage: number = 5;                    // Nombre d'éléments par page
  isLoading: boolean = true;                   // Indicateur de chargement
  searchQuery: string = '';                    // Champ de recherche
  noResults: boolean = false;                  // Indicateur d'absence de résultats

  constructor(private historicPointageService: HistoricPointageService) {}

  ngOnInit() {
    this.loadHistoriques();  // Charger les historiques au démarrage
  }

  // Fonction pour charger les historiques depuis l'API
  loadHistoriques() {
    this.historicPointageService.getAll().subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          this.historiques = data.map((item: any) => {
            const utilisateur = item.utilisateur || {};
            return {
              firstName: utilisateur.prenom || 'N/A',
              lastName: utilisateur.nom || 'N/A',
              matricule: utilisateur.matricule || 'N/A',
              date: new Date(item.created_at).toLocaleDateString(),
              time: new Date(item.created_at).toLocaleTimeString(),
              action: item.action || 'Aucune action'
            };
          });

          this.totalPages = Math.ceil(this.historiques.length / this.itemsPerPage);
          this.filteredHistoriques = this.historiques.slice(0, this.itemsPerPage);
        } else {
          console.error('La réponse ne contient pas un tableau sous la clé "data" ou il est vide');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des historiques', err);
        this.isLoading = false;
      }
    });
  }

  // Fonction pour filtrer les historiques en fonction de la recherche
  filterHistoriques(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;

    const filtered = this.historiques.filter(historique =>
      historique.firstName.toLowerCase().includes(query) ||
      historique.lastName.toLowerCase().includes(query) ||
      historique.matricule.toLowerCase().includes(query)  // Recherche sur le matricule aussi
    );

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredHistoriques = filtered.slice(0, this.itemsPerPage);
    this.noResults = filtered.length === 0; // Vérifie si aucun résultat n'est trouvé
  }

  // Fonction pour changer de page dans la pagination
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    if (start < 0 || end > this.historiques.length) {
      console.error('Découpage invalide. Vérifiez les indices.');
      return;
    }

    this.filteredHistoriques = this.historiques.slice(start, end);
  }
}
