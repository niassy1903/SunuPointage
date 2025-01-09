import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PointageService } from '../pointage.service';

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
  private ws: WebSocket | null = null;

  totalPointages: number = 0;
  totalValidations: number = 0;
  totalRejets: number = 0;

  constructor(
    private utilisateurService: UtilisateurService,
    private pointageService: PointageService
  ) {}


  ngOnInit() {
    this.connectWebSocket();
    this.updateDateTime();
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);

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



  // Mettre à jour la valeur d'une carte spécifique
  updateCardValue(index: number, value: number): void {
    this.cards[index].value = value;
  }


  cards: any[] = [
    {
      title: 'Total Pointées',
      value: this.totalPointages,
      icon: 'bi-people-fill',
      color: 'text-success',
      smallText: '2 nouveaux employés !',
      smallIcon: 'bi-plus-circle',
      smallColor: 'text-success',
    },
    {
      title: 'Total Validation',
      value: this.totalValidations,
      icon: 'bi-check-circle-fill',
      color: 'text-success',
      smallText: '-10% Moins qu’hier',
      smallIcon: 'bi-dash-circle',
      smallColor: 'text-muted',
    },
    {
      title: 'Total Rejetée',
      value: this.totalRejets,
      icon: 'bi-x-circle-fill',
      color: 'text-danger',
      smallText: '+3% Augmentation par rapport à hier',
      smallIcon: 'bi-plus-circle',
      smallColor: 'text-danger',
    }
  ];

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
        this.imagePreview = '/images/profil.png'; // Photo par défaut
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
    const storedCardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');

    if (storedCardIds.includes(cardId)) {
      this.isFirstPointageDone = true;
      this.pointageId = null;
    } else {
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
  }

  // loadPointagesData(): void {
  //   const today = new Date().toISOString().split('T')[0];

  //   this.pointageService.getTotalPointages(today).subscribe(
  //     (data) => {
  //       this.totalPointages = data.total_pointages;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des pointages :', error);
  //     }
  //   );

  //   this.pointageService.getTotalValidations(today).subscribe(
  //     (data) => {
  //       this.totalValidations = data.total_validations;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des validations :', error);
  //     }
  //   );

  //   this.pointageService.getTotalRejets(today).subscribe(
  //     (data) => {
  //       this.totalRejets = data.total_rejets;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des rejets :', error);
  //     }
  //   );
  // }
  loadPointagesData(): void {
    const today = new Date().toISOString().split('T')[0];
  
    this.pointageService.getTotalPointages(today).subscribe(
      (data) => {
        this.totalPointages = data.total_pointages;
        // Mettre à jour les cartes avec la nouvelle valeur
        this.cards[0].value = this.totalPointages;
      },
      (error) => {
        console.error('Erreur lors de la récupération des pointages :', error);
      }
    );
  
    this.pointageService.getTotalValidations(today).subscribe(
      (data) => {
        this.totalValidations = data.total_validations;
        // Mettre à jour les cartes avec la nouvelle valeur
        this.cards[1].value = this.totalValidations;
      },
      (error) => {
        console.error('Erreur lors de la récupération des validations :', error);
      }
    );
  
    this.pointageService.getTotalRejets(today).subscribe(
      (data) => {
        this.totalRejets = data.total_rejets;
        // Mettre à jour les cartes avec la nouvelle valeur
        this.cards[2].value = this.totalRejets;
      },
      (error) => {
        console.error('Erreur lors de la récupération des rejets :', error);
      }
    );
  }
  

  onSubmit(): void {
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
      this.confirmSecondPointage();
    } else {
      this.confirmFirstPointage();
    }
  }

  confirmFirstPointage() {
    const heureArrivee = new Date();
    const formattedHeureArrivee = this.formatTime(heureArrivee);

    const heureLimite = "09:00";
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
    const [heureArriveeHeures, heureArriveeMinutes] = heureArrivee.split(":").map(Number);
    const [heureLimiteHeures, heureLimiteMinutes] = heureLimite.split(":").map(Number);

    if (heureArriveeHeures > heureLimiteHeures || (heureArriveeHeures === heureLimiteHeures && heureArriveeMinutes > heureLimiteMinutes)) {
      return true;
    }
    return false;
  }

  confirmSecondPointage() {
    const cardIds = JSON.parse(localStorage.getItem('cardIds') || '[]');
    if (!cardIds || !cardIds.includes(this.formData.cardId)) {
      console.error('Le cardId n\'est pas trouvé dans le localStorage');
      return;
    }

    const heureDepart = this.formatTime(new Date());
    const pointageData: any = { heure_depart: heureDepart };

    this.utilisateurService.updatePointage(this.formData.cardId, pointageData).subscribe(
      (response) => {
        console.log('Pointage mis à jour :', response);
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

    // Vérifie si l'heure est 23:59 pour supprimer les cardIds du localStorage
    if (hours === '23' && minutes === '59' && seconds === '00') {
      localStorage.removeItem('cardIds');
      console.log('Tous les cardIds ont été supprimés du localStorage à 23:59.');
    }

    this.loadPointagesData();
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onToggleChange(event: any): void {
    const isChecked = event.target.checked;
    this.sendDoorCommand(isChecked);
  }
  
  sendDoorCommand(isOpen: boolean): void {
    if (this.ws) {
      const command = {
        type: 'doorControl',
        action: isOpen ? 'open' : 'close', // "open" ou "close" en fonction de l'état du bouton
      };
      this.ws.send(JSON.stringify(command)); // Envoi de la commande au serveur Node.js via WebSocket
    }
  }
}
