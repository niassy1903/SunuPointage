import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

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
  standalone:true,
  imports : [FormsModule,CommonModule]
})

export class HistoriqueComponent implements OnInit {
  historiques: Historique[] = [
    { firstName: 'Mouhamed', lastName: 'Diop', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' },
    { firstName: 'Babacar', lastName: 'Ndiaye', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' },
    { firstName: 'Momar', lastName: 'Fall', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' },
    { firstName: 'Anta', lastName: 'Faye', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' },
    { firstName: 'Ma Khady', lastName: 'Diaw', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' },
    { firstName: 'Oumou Khairy', lastName: 'Ndiaye', date: '17 décembre 2024', time: '18h 25 min', action: 'Vous avez validé un pointage' }
  ];
  filteredHistoriques: Historique[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;

  ngOnInit() {
    this.filteredHistoriques = this.historiques.slice(0, this.itemsPerPage);
    this.totalPages = Math.ceil(this.historiques.length / this.itemsPerPage);
  }

  filterHistoriques(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    const filtered = this.historiques.filter(historique =>
      historique.firstName.toLowerCase().includes(query.toLowerCase()) ||
      historique.lastName.toLowerCase().includes(query.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredHistoriques = filtered.slice(0, this.itemsPerPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredHistoriques = this.historiques.slice(start, end);
  }
}
