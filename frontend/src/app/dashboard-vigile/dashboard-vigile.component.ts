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
  private ws: WebSocket | null = null; // Initialiser avec null

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
    if (this.ws) {
      this.ws.close();
    }
  }

  connectWebSocket() {
    this.ws = new WebSocket('ws://localhost:8081');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'cardRead') {
        const cardId = message.cardId;
        console.log('Card ID reçu :', cardId);
        this.formData.cardId = cardId;
        this.loginByCardId(cardId);
      }
    };

    this.ws.onopen = () => {
      console.log('Connexion WebSocket ouverte');
    };

    this.ws.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };

    this.ws.onerror = (error) => {
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
  
  checkPointageStatus(cardId: string): void {
    // Vérification initiale dans le localStorage
    const storedCardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');
  
    if (storedCardIds.includes(cardId)) {
      // Le cardId est déjà enregistré localement
      this.isFirstPointageDone = true;
      this.pointageId = null; // Pas besoin d'ID de pointage dans ce cas
    } else {
      // Si non trouvé dans localStorage, vérifier via l'API
      this.utilisateurService.getPointageByCardId(cardId).subscribe(
        (response) => {
          if (response && response.heure_depart === null) {
            // Un pointage existe et n'est pas encore terminé
            this.pointageId = response.id;
            this.isFirstPointageDone = true;
          } else {
            // Aucun pointage actif trouvé
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
  }
  
  loadPointagesData(): void {
    const today = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
  
    // Charger le total des pointages
    this.pointageService.getTotalPointages(today).subscribe(
      (data) => {
        this.totalPointages = data.total_pointages; // Mise à jour du total
      },
      (error) => {
        console.error('Erreur lors de la récupération des pointages :', error);
      }
    );
  
    // Charger le total des pointages validés
    this.pointageService.getTotalValidations(today).subscribe(
      (data) => {
        this.totalValidations = data.total_validations; // Mise à jour des validations
      },
      (error) => {
        console.error('Erreur lors de la récupération des validations :', error);
      }
    );
  
    // Charger le total des pointages rejetés
    this.pointageService.getTotalRejets(today).subscribe(
      (data) => {
        this.totalRejets = data.total_rejets; // Mise à jour des rejets
      },
      (error) => {
        console.error('Erreur lors de la récupération des rejets :', error);
      }
    );
  }
  
  onSubmit(): void {
    // Afficher le modal de pointage lors de la soumission
    this.showPointageModal();
  }
  
  showPointageModal(): void {
    const modalElement = document.getElementById('pointageModal');
    if (modalElement) {
      this.pointageModal = new bootstrap.Modal(modalElement);
      this.pointageModal.show();
    } else {
      console.error('Modal de pointage non trouvé dans le DOM.');
    }
  }
  
  
  confirmPointage() {
    const storedCardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');
    if (storedCardIds.includes(this.formData.cardId)) {
      // Deuxième pointage
      this.confirmSecondPointage();
    } else {
      // Premier pointage
      this.confirmFirstPointage();
    }
  }
  
  confirmFirstPointage() {
    const heureArrivee = new Date();
    const formattedHeureArrivee = this.formatTime(heureArrivee);
  
    const heureLimite = "09:00"; // Heure limite pour considérer un pointage à l'heure
    const estRetard = this.isHeureDeRetard(formattedHeureArrivee, heureLimite);
  
    const pointageData: any = {
      carte_id: this.formData.cardId,
      nom: this.formData.name,
      prenom: this.formData.prenom,
      heure_arrivee: formattedHeureArrivee,
      statut: estRetard ? 'retard' : 'present',
    };
  
    this.utilisateurService.createPointage(pointageData).subscribe(
      (response) => {
        console.log('Pointage créé :', response);
        this.pointageId = response.id;
        this.isFirstPointageDone = true;
  
        // Ajouter le cardId dans un tableau stocké dans localStorage
        let cardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');
        cardIds.push(this.formData.cardId);
        localStorage.setItem('cardIds', JSON.stringify(cardIds));
  
        this.showSuccessModal();
      },
      (error) => {
        console.error('Erreur lors de la création du pointage :', error);
      }
    );
  }
  
  isHeureDeRetard(heureArrivee: string, heureLimite: string): boolean {
    // Convertir l'heure dans un format 24h pour la comparaison
    const [heureArriveeHeures, heureArriveeMinutes] = heureArrivee.split(":").map(Number);
    const [heureLimiteHeures, heureLimiteMinutes] = heureLimite.split(":").map(Number);
  
    if (heureArriveeHeures > heureLimiteHeures || (heureArriveeHeures === heureLimiteHeures && heureArriveeMinutes > heureLimiteMinutes)) {
      return true; // Retard
    }
    return false; // Pas de retard
  }
  
  
// Modifier la fonction confirmSecondPointage pour récupérer le tableau de cardIds
confirmSecondPointage() {
  const cardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');
  if (!cardIds || !cardIds.includes(this.formData.cardId)) {
    console.error('Le cardId n\'est pas trouvé dans le localStorage');
    return; // Vous pouvez gérer cette erreur comme vous le souhaitez
  }

  const heureDepart = this.formatTime(new Date());
  const pointageData: any = { heure_depart: heureDepart };

  this.utilisateurService.updatePointage(this.formData.cardId, pointageData).subscribe(
    (response) => {
      console.log('Pointage mis à jour :', response);
      
      // Supprimer le cardId du localStorage après le deuxième pointage
      const updatedCardIds = cardIds.filter((id: string) => id !== this.formData.cardId);
      localStorage.setItem('cardIds', JSON.stringify(updatedCardIds));
      
      this.showSuccessModal();
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du pointage :', error);
    }
  );
}
  

  rejectPointage() {
    const pointageData: any = {
      carte_id: this.formData.cardId,
      nom: this.formData.name,
      prenom: this.formData.prenom,
      heure_arrivee: null,
      heure_depart: null,
      statut: 'rejeter',
    };

    this.utilisateurService.createPointage(pointageData).subscribe(
      (response) => {
        console.log('Pointage rejeté :', response);
        this.showErrorModal();
      },
      (error) => {
        console.error('Erreur lors du rejet du pointage :', error);
      }
    );
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
    this.rejectPointage();
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
