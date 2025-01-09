import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilisateurService } from '../utilisateur.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var bootstrap: any;

interface Presence {
  matricule: string;
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
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [UtilisateurService],
})
export class PresenceComponent implements OnInit, OnDestroy {
  searchText: string = '';
  currentDate: string = new Date().toLocaleDateString('fr-FR');
  presences: Presence[] = [];
  filteredPresences: Presence[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  noResults: boolean = false;

  private dataSubject = new Subject<Presence[]>();
  private ngUnsubscribe = new Subject<void>();

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.dataSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.presences = data;
      this.filteredPresences = [...this.presences]; // Affiche tous les utilisateurs par défaut
      this.updatePagination();
    });

    this.fetchUtilisateurs();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  fetchUtilisateurs(): void {
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => {
        console.log('Utilisateurs reçus :', data);
        const updatedPresences = data.map((user) => ({
          matricule: user.matricule,
          card_id: user.card_id,
          nom: user.nom,
          prenom: user.prenom,
          statut: 'Absent',
          date_actuelle: new Date(),
          heure_arrivee: '--',
          heure_depart: '--',
          temps_travail: '--',
          isChecked: false,
        }));

        this.loadPointageData(updatedPresences);
        this.dataSubject.next(updatedPresences);
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
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

      this.utilisateurService.createPointagesBatch(pointageData).subscribe(
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

  loadPointageData(presences: Presence[]): void {
    presences.forEach((presence) => {
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
  }

  calculateWorkTime(arrivee: string | null | undefined, depart: string | null | undefined): string {
    if (!arrivee || !depart || arrivee === '--' || depart === '--') {
      return '--';
    }

    const [arriveeH, arriveeM] = arrivee.split(':').map(Number);
    const [departH, departM] = depart.split(':').map(Number);

    const arriveeMinutes = arriveeH * 60 + arriveeM;
    const departMinutes = departH * 60 + departM;
    const diffMinutes = departMinutes - arriveeMinutes;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  filterPresences(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (query === '') {
      this.filteredPresences = [...this.presences]; // Réinitialiser le tableau pour afficher toutes les données
      this.noResults = false;
    } else {
      this.filteredPresences = this.presences.filter((presence) =>
        presence.nom.toLowerCase().includes(query) ||
        presence.prenom.toLowerCase().includes(query) ||
        presence.card_id.toLowerCase().includes(query) ||
        presence.matricule.toLowerCase().includes(query) // Recherche également par matricule
      );

      this.noResults = this.filteredPresences.length === 0;
    }

    this.updatePagination();
  }

  filterByStatut(event: Event): void {
    const selectedStatut = (event.target as HTMLSelectElement).value;

    if (selectedStatut === 'tous') {
      this.filteredPresences = [...this.presences]; // Montrer tous les utilisateurs
    } else {
      this.filteredPresences = this.presences.filter((presence) =>
        presence.statut.toLowerCase() === selectedStatut.toLowerCase()
      );
    }

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredPresences = this.filteredPresences.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    this.updatePagination();
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredPresences.length / this.itemsPerPage);
  }

  getStatutStyle(statut: string): { [klass: string]: any } {
    switch (statut) {
      case 'Absent':
        return { color: 'red', fontWeight: 'bold' };
      case 'Present':
        return { color: 'green', fontWeight: 'bold' };
      case 'yellow':
        return { color: 'yellow', fontWeight: 'bold' };
      default:
        return {};
    }
  }

  showSuccessModal(): void {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  openConfirmationModal(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  saveChanges(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    }

    const pointageData = this.presences
      .filter((presence) => presence.isChecked && presence.statut === 'Absent')
      .map((presence) => ({
        matricule: presence.matricule,
        carte_id: presence.card_id,
        nom: presence.nom,
        prenom: presence.prenom,
        heure_arrivee: this.formatTime(presence.heure_arrivee),
        heure_depart: this.formatTime(presence.heure_depart),
        statut: this.formatStatut(presence.statut),
      }));

    if (pointageData.length === 0) {
      alert('Aucune donnée valide à enregistrer.');
      return;
    }

    this.utilisateurService.createPointagesBatch(pointageData).subscribe(
      (response) => {
        console.log('Modifications enregistrées :', response);
        this.showSuccessModal();
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement des modifications :', error);
      }
    );
  }

  formatTime(time: string): string {
    if (!time || time === '--') return '';
    const [hours, minutes] = time.split(':').map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  formatStatut(statut: string): string {
    if (!statut || statut === '--') return 'absent';
    return statut.toLowerCase();
  }

  toggleAllAbsent(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.presences.forEach((presence) => {
      if (presence.statut === 'Absent') {
        presence.isChecked = isChecked;
      }
    });
  }
}
