import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartementService } from '../departement.service';
import { CohorteService } from '../cohorte.service';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';


declare var bootstrap: any;

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,  HttpClientModule, FormsModule, RouterModule],
  providers: [UtilisateurService, DepartementService, CohorteService]
})
export class InscriptionComponent implements OnInit, OnDestroy {
  inscriptionForm: FormGroup;
  fonction: string = '';
  showNextStep: boolean = false;
  departements: any[] = [];
  cohortes: any[] = [];
  passwordStrength: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  telephoneExists: boolean = false;
  cardIdExists: boolean = false;
  ws: WebSocket;
  isAssigningCard: boolean = false; // Ajout de cette propriété
  scannedCardId: string = ''; // Ajout de cette variable pour stocker le cardId scanné

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private cohorteService: CohorteService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern('^[a-zA-Zà-üÀ-Ü ]+$')]],
      prenom: ['', [Validators.required, Validators.pattern('^[a-zA-Zà-üÀ-Ü ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, this.telephoneValidator()]],
      fonction: ['', Validators.required],
      photo: [''],
      departement: [''],
      cohorte: [''],
      mot_de_passe: ['', [Validators.minLength(6), this.passwordStrengthValidator()]],
      confirm_mot_de_passe: ['', [Validators.minLength(6)]],
      card_id: ['', Validators.required] // Ajout du champ card_id
    }, { validator: this.passwordMatchValidator });

    this.inscriptionForm.get('telephone')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.utilisateurService.checkTelephoneExists(value))
      )
      .subscribe(response => {
        this.telephoneExists = response.exists;
        if (response.exists) {
          this.inscriptionForm.get('telephone')?.setErrors({ telephoneExists: true });
        } else {
          this.inscriptionForm.get('telephone')?.setErrors(null);
        }
      });

    // Initialize WebSocket connection
    this.ws = new WebSocket('ws://localhost:8080');
  }

  ngOnInit() {
    this.departementService.getDepartements().subscribe(data => {
      this.departements = data;
    });

    this.cohorteService.getCohortes().subscribe(data => {
      this.cohortes = data;
    });

    const fonctionControl = this.inscriptionForm.get('fonction');
    if (fonctionControl) {
      this.fonction = fonctionControl.value;
    }

    // Se connecter au serveur WebSocket
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'cardRead') {
        this.scannedCardId = data.cardId; // Stocker le cardId scanné
        this.inscriptionForm.get('card_id')?.setValue(this.scannedCardId);
        this.checkCardIdExists(this.scannedCardId);
      }
    };
  }

  ngOnDestroy() {
    // Fermer la connexion WebSocket
    if (this.ws) {
      this.ws.close();
    }
  }

  telephoneValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const telephonePattern = /^(70|77|75|76|78)\d{7}$/;
      const valid = telephonePattern.test(control.value);
      return valid ? null : { invalidTelephone: { valid } };
    };
  }

  passwordStrengthValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      let strength = 'Mauvais';
      if (value) {
        if (value.length >= 8) {
          strength = 'Bon';
          if (/[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)) {
            strength = 'Fort';
          } else if (/[A-Z]/.test(value) || /[a-z]/.test(value) || /\d/.test(value)) {
            strength = 'Moyen';
          }
        }
      }
      this.passwordStrength = strength;
      return null;
    };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const motDePasse = formGroup.get('mot_de_passe')?.value;
    const confirmMotDePasse = formGroup.get('confirm_mot_de_passe')?.value;

    if (motDePasse && confirmMotDePasse && motDePasse !== confirmMotDePasse) {
      formGroup.get('confirm_mot_de_passe')?.setErrors({ notMatch: true });
    } else {
      formGroup.get('confirm_mot_de_passe')?.setErrors(null);
    }
  }

  getPasswordStrengthWidth(): number {
    switch (this.passwordStrength) {
      case 'Mauvais':
        return 25;
      case 'Moyen':
        return 50;
      case 'Bon':
        return 75;
      case 'Fort':
        return 100;
      default:
        return 0;
    }
  }

  onFonctionChange() {
    const fonctionControl = this.inscriptionForm.get('fonction');
    if (fonctionControl) {
      this.fonction = fonctionControl.value;
      this.updatePasswordControls();
    }
  }

  updatePasswordControls() {
    const motDePasseControl = this.inscriptionForm.get('mot_de_passe');
    const confirmMotDePasseControl = this.inscriptionForm.get('confirm_mot_de_passe');

    if (this.fonction === 'apprenant' || this.fonction === 'employer') {
      motDePasseControl?.clearValidators();
      motDePasseControl?.updateValueAndValidity();
      confirmMotDePasseControl?.clearValidators();
      confirmMotDePasseControl?.updateValueAndValidity();
    } else {
      motDePasseControl?.setValidators([Validators.minLength(6), this.passwordStrengthValidator()]);
      motDePasseControl?.updateValueAndValidity();
      confirmMotDePasseControl?.setValidators([Validators.minLength(6)]);
      confirmMotDePasseControl?.updateValueAndValidity();
    }
  }

  nextStep() {
    this.showNextStep = true;
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const formData = this.inscriptionForm.value;
      formData.mot_de_passe = formData.mot_de_passe || '';
      formData.confirm_mot_de_passe = formData.confirm_mot_de_passe || '';

      this.utilisateurService.createUtilisateur(formData).subscribe(
        response => {
          console.log('Utilisateur créé avec succès', response);

          // Afficher le modal de succès
          const successModal = new bootstrap.Modal(document.getElementById('successModal')!);
          successModal.show();

          // Rediriger après quelques secondes (optionnel)
          setTimeout(() => {
            this.router.navigate(['/utilisateur']); // Remplacez '/utilisateur' par la route correcte
          }, 10000);
        },
        error => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkCardIdExists(cardId: string) {
    this.utilisateurService.checkCardIdExists(cardId).subscribe(
      response => {
        this.cardIdExists = response.exists;
        if (response.exists) {
          this.inscriptionForm.get('card_id')?.setErrors({ cardIdExists: true });
        } else {
          this.inscriptionForm.get('card_id')?.setErrors(null);
        }
      },
      error => {
        console.error('Erreur lors de la vérification de la carte', error);
      }
    );
  }

  scanCard() {
    this.isAssigningCard = true;
    this.ws.send(JSON.stringify({ type: 'scanCard' }));
  }
}
