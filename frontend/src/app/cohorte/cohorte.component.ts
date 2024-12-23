import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CohorteService } from '../cohorte.service';

interface Cohorte {
  name: string;
  description: string;
  capacity: number; // Données fictives pour l'instant
}

@Component({
  selector: 'app-cohorte',
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, NavbarComponent, HttpClientModule],
  providers: [CohorteService],
})
export class CohorteComponent implements OnInit {
  cohortes: Cohorte[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private cohorteService: CohorteService) {}

  ngOnInit() {
    this.loadCohortes();
  }

  loadCohortes() {
    this.cohorteService.getCohortes().subscribe({
      next: (data) => {
        this.cohortes = data.map((cohorte) => ({
          name: cohorte.nom,
          description: cohorte.description,
          capacity: 0, // Valeur fictive
        }));
        this.totalPages = Math.ceil(this.cohortes.length / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cohortes :', err);
      },
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
}
