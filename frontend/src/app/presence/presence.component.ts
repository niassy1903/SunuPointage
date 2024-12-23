import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, NavbarComponent],
})
export class PresenceComponent {
  searchText: string = '';
  currentDate: string = new Date().toLocaleDateString('fr-FR');

  presences = [
    {
      id: '2341421',
      employe: 'Mouhamed Ali',
      role: 'Apprenant',
      departement: 'IT Department',
      date: '29 juillet 2023',
      statut: 'Ponctuelle',
      arrivee: '09:00',
      depart: '18:00',
      tempsTravail: '10h 2m',
    },
    {
      id: '3411421',
      employe: 'Babacar Kane',
      role: 'Apprenant',
      departement: 'Marketing',
      date: '29 juillet 2023',
      statut: 'Absent',
      arrivee: '00:00',
      depart: '00:00',
      tempsTravail: '0m',
    },
    {
      id: '5678421',
      employe: 'Fatima Diop',
      role: 'Apprenant',
      departement: 'Finance',
      date: '29 juillet 2023',
      statut: 'Retard',
      arrivee: '10:00',
      depart: '18:00',
      tempsTravail: '8h 2m',
    },
  ];

  get filteredPresences() {
    return this.presences.filter((p) =>
      p.employe.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Ponctuelle':
        return 'badge-ponctuelle';
      case 'Absent':
        return 'badge-absent';
      case 'Retard':
        return 'badge-retard';
      case 'Travail à distance':
        return 'badge-telework';
      default:
        return '';
    }
  }
}
