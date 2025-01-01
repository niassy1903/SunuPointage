import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../utilisateur.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap : any;

interface Presence {
  card_id: string;
  nom: string;
  prenom: string;
  statut: string;
  date_actuelle: Date;
  heure_arrivee: string;
  heure_depart: string;
  temps_travail: string;
  isChecked?: boolean;
}

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
  standalone: true,
  imports: [FormsModule, SidebarComponent, NavbarComponent, CommonModule, HttpClientModule],
  providers: [UtilisateurService],
})
export class PresenceComponent implements OnInit {
  searchText: string = '';
  currentDate: string = new Date().toLocaleDateString('fr-FR');
  presences: Presence[] = [];
  filteredPresences: Presence[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.fetchUtilisateurs();
  }

  fetchUtilisateurs(): void {
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => {
        console.log('Utilisateurs reçus :', data);
        this.presences = data.map(user => ({
          card_id: user.card_id,
          nom: user.nom,
          prenom: user.prenom,
          statut: 'Absent',  // Statut par défaut
          date_actuelle: new Date(),
          heure_arrivee: '--',
          heure_depart: '--',
          temps_travail: '--',
          isChecked: false
        }));

        // Récupérer les données de pointage pour chaque utilisateur
        this.presences.forEach(presence => {
          this.utilisateurService.getPointageByCardId(presence.card_id).subscribe(
            (pointage) => {
              presence.statut = pointage.statut;
              presence.heure_arrivee = pointage.heure_arrivee;
              presence.heure_depart = pointage.heure_depart;
              presence.temps_travail = this.calculateWorkTime(presence.heure_arrivee, presence.heure_depart);
            },
            (error) => {
              console.error('Erreur lors du chargement du pointage:', error);
            }
          );
        });
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
  }

  // Calculer le temps de travail
  calculateWorkTime(arrivee: string, depart: string): string {
    if (arrivee === '--' || depart === '--') return '--';

    const [arriveeH, arriveeM] = arrivee.split(':').map(Number);
    const [departH, departM] = depart.split(':').map(Number);

    const arriveeMinutes = arriveeH * 60 + arriveeM;
    const departMinutes = departH * 60 + departM;
    const diffMinutes = departMinutes - arriveeMinutes;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  // Filtrage par texte
  filterPresences(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filteredPresences = this.presences.filter(presence =>
      presence.nom.toLowerCase().includes(query.toLowerCase()) ||
      presence.prenom.toLowerCase().includes(query.toLowerCase())
    );
    this.updatePagination();
  }

  // Pagination
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredPresences = this.presences.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    this.updatePagination();
  }

  getTotalPages(): number {
    return Math.ceil(this.presences.length / this.itemsPerPage);
  }

  getStatutStyle(status: string): { [klass: string]: any } {
    if (status === 'Absent') {
      return { color: 'red', fontWeight: 'bold' };
    } else if (status === 'Present') {
      return { color: 'green', fontWeight: 'bold' };
    }
    return {};
  }

  markAbsentUsers(): void {
    const absentUsers = this.presences.filter(presence => presence.isChecked);
    if (absentUsers.length > 0) {
      const pointageData = absentUsers.map(user => ({
        carte_id: user.card_id,
        nom: user.nom,
        prenom: user.prenom,
        heure_arrivee: null,
        heure_depart: null,
        statut: 'absent',
      }));

      this.utilisateurService.createPointage(pointageData).subscribe(
        (response) => {
          console.log('Utilisateurs marqués absents :', response);
          this.showSuccessModal();
        },
        (error) => {
          console.error('Erreur lors du marquage des utilisateurs absents :', error);
        }
      );
    } else {
      alert('Aucun utilisateur sélectionné.');
    }
  }

  showSuccessModal(): void {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }
}
