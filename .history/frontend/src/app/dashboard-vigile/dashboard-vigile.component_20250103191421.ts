import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PointageService } from '../pointage.service'; // Import du service PointageService

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard-vigile',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './dashboard-vigile.component.html',
  styleUrls: ['./dashboard-vigile.component.css'],
  providers: [UtilisateurService, PointageService],
})
export class DashboardVigileComponent implements OnInit, OnDestroy {
  formData = {
    name: '',
    prenom: '',
    fonction: '',
    cardId: '',
    photo: ''
  };

  imagePreview: string | null = null;
  showForm: boolean = false;
  showImage: boolean = false;
  showUserSection: boolean = false;
  showProcessSection: boolean = true;
  currentTime: string = '';
  currentDate: string = '';
  private intervalId: any;
  private pointageId: string | null = null;
  private pointageModal: any;
  isFirstPointageDone: boolean = false;

  totalPointages: number = 0;
  totalValidations: number = 0;
  totalRejets: number = 0;
  
  constructor(
    private utilisateurService: UtilisateurService,
    private pointageService: PointageService // Injection du service PointageService
  ) {}

  ngOnInit() {
    this.connectWebSocket();
    this.updateDateTime();
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Appeler les méthodes pour obtenir les données des pointages, validations et rejets
    this.loadPointagesData();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  connectWebSocket() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const cardId = message.cardId;
      console.log('Card ID reçu :', cardId);
      this.formData.cardId = cardId;
      this.loginByCardId(cardId);
    };

    ws.onopen = () => {
      console.log('Connexion WebSocket ouverte');
    };

    ws.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };

    ws.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };
  }

  loginByCardId(cardId: string) {
    this.utilisateurService.loginByCardId(cardId).subscribe(
      (response) => {
        console.log('Utilisateur trouvé :', response);
        this.formData.name = response.utilisateur.nom;
        this.formData.prenom = response.utilisateur.prenom;
        this.formData.fonction = response.utilisateur.fonction;
        this.formData.photo = response.utilisateur.photo;
        this.imagePreview = response.utilisateur.photo;
        this.showImage = true;
        this.showForm = true;
        this.showUserSection = true;
        this.showProcessSection = false;
        this.checkPointageStatus(cardId);
      },
      (error) => {
        console.error('Erreur lors de la connexion par carte ID :', error);
      }
    );
  }

  checkPointageStatus(cardId: string) {
    this.utilisateurService.getPointageByCardId(cardId).subscribe(
      (response) => {
        if (response && response.heure_depart === null) {
          this.pointageId = response.id;
          this.isFirstPointageDone = true;
        } else {
          this.pointageId = null;
          this.isFirstPointageDone = false;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du pointage :', error);
        this.pointageId = null;
        this.isFirstPointageDone = false;
      }
    );
  }
  loadPointagesData() {
    const date = this.currentDate; // Utiliser la date actuelle du composant

    // Récupérer le total des pointages
    this.pointageService.getTotalPointages(date).subscribe(
      (data) => {
        this.totalPointages = data.total_pointages; // Mettez à jour la variable totalPointages
      },
      (error) => {
        console.error('Erreur lors de la récupération des pointages :', error);
      }
    );

    // Récupérer le total des pointages validés
    this.pointageService.getTotalValidations(date).subscribe(
      (data) => {
        this.totalValidations = data.total_validations; // Mettez à jour la variable totalValidations
      },
      (error) => {
        console.error('Erreur lors de la récupération des validations :', error);
      }
    );

    // Récupérer le total des pointages rejetés
    this.pointageService.getTotalRejets(date).subscribe(
      (data) => {
        this.totalRejets = data.total_rejets; // Mettez à jour la variable totalRejets
      },
      (error) => {
        console.error('Erreur lors de la récupération des rejets :', error);
      }
    );
}


  onSubmit() {
    this.showPointageModal();
  }

  showPointageModal() {
    const modalElement = document.getElementById('pointageModal');
    if (modalElement) {
      this.pointageModal = new bootstrap.Modal(modalElement);
      this.pointageModal.show();
    }
  }

  confirmFirstPointage() {
    const heureArrivee = this.formatTime(new Date());
    const pointageData: any = {
      carte_id: this.formData.cardId,
      nom: this.formData.name,
      prenom: this.formData.prenom,
      heure_arrivee: heureArrivee,
      statut: 'present',
    };

    this.utilisateurService.createPointage(pointageData).subscribe(
      (response) => {
        console.log('Pointage créé :', response);
        this.pointageId = response.id;
        this.isFirstPointageDone = true;
        this.pointageModal.hide(); // Fermer le modal de validation
        this.showSuccessModal();
      },
      (error) => {
        console.error('Erreur lors de la création du pointage :', error);
      }
    );
  }

  confirmSecondPointage() {
    if (this.pointageId) {
      const heureDepart = this.formatTime(new Date());
      const pointageData: any = {
        heure_depart: heureDepart,
      };

      this.utilisateurService.updatePointage(this.pointageId, pointageData).subscribe(
        (response) => {
          console.log('Pointage mis à jour :', response);
          this.pointageModal.hide(); // Fermer le modal de validation
          this.showSuccessModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du pointage :', error);
        }
      );
    } else {
      this.showErrorModal();
    }
  }

  showSuccessModal() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  showErrorModal() {
    const modalElement = document.getElementById('errorModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      prenom: '',
      fonction: '',
      cardId: '',
      photo: '',
    };
    this.showForm = false;
    this.showImage = false;
    this.showUserSection = false;
    this.showProcessSection = true;
    this.isFirstPointageDone = false;
  }

  onReject() {
    console.log('Rejeté');
    alert('Formulaire rejeté.');
    this.showForm = false;
    this.showImage = false;
    this.showUserSection = false;
    this.showProcessSection = true;
  }

  updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    this.currentTime = `${hours}:${minutes}:${seconds}`;
    this.currentDate = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    // Recharger les données des pointages à chaque changement de date
    this.loadPointagesData();
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
