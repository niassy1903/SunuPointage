import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HistoricPointageService } from '../historic-pointage.service';
import { HttpClientModule } from '@angular/common/http';  // Ajouter ceci

interface Historique {
  firstName: string;
  lastName: string;
  date: string;
  time: string;
  action: string;
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],  // Ajouter HttpClientModule ici
  providers: [HistoricPointageService]
})
export class HistoriqueComponent implements OnInit {
  historiques: Historique[] = [];
  filteredHistoriques: Historique[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = true;

  constructor(private historicPointageService: HistoricPointageService) {}

  ngOnInit() {
    this.loadHistoriques();
  }

  /**
   * Charge les historiques depuis l'API
   */
  
  loadHistoriques() {
    this.historicPointageService.getAll().subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response);  // Afficher la réponse complète pour vérification
        const data = response.data;
        
        if (Array.isArray(data) && data.length > 0) {
          this.historiques = data.map((item: any) => {
            const utilisateur = item.utilisateur || {};
            return {
              firstName: utilisateur.prenom || 'N/A',
              lastName: utilisateur.nom || 'N/A',
              date: new Date(item.created_at).toLocaleDateString(),
              time: new Date(item.created_at).toLocaleTimeString(),
              action: item.action || 'Aucune action'
            };
          });
  
          console.log('Historiques:', this.historiques);  // Vérifier le contenu des historiques
          this.totalPages = Math.ceil(this.historiques.length / this.itemsPerPage) || 1;
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
  
  /**
   * Filtre les historiques en fonction de la recherche
   * @param event Événement d'entrée utilisateur
   */
  filterHistoriques(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    const filtered = this.historiques.filter(historique =>
      historique.firstName.toLowerCase().includes(query.toLowerCase()) ||
      historique.lastName.toLowerCase().includes(query.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredHistoriques = filtered.slice(0, this.itemsPerPage);
  }

  /**
   * Change la page actuelle pour afficher d'autres historiques
   * @param page Numéro de la page
   */
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;  // Vérification de la page valide
    this.currentPage = page;
  
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
  
    // Vérification du découpage du tableau
    console.log('Start:', start, 'End:', end, 'Total items:', this.historiques.length);
  
    if (start < 0 || end > this.historiques.length) {
      console.error('Découpage invalide. Vérifiez les indices.');
      return;
    }
  
    this.filteredHistoriques = this.historiques.slice(start, end);
  }
  
}
