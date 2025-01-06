import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CohorteService } from '../cohorte.service';
import { DepartementService } from '../departement.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

declare var bootstrap: any;



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [SidebarComponent, CommonModule, NavbarComponent, ReactiveFormsModule, HttpClientModule,RouterModule],
  providers: [UtilisateurService, CohorteService, DepartementService]
})
export class EditComponent implements OnInit {
  editForm: FormGroup;
  showNextStep: boolean = false;
  fonction: string = '';
  departements: any[] = [];
  cohortes: any[] = [];
  passwordStrength: string = '';
  showAncienPassword: boolean = false;
  showNewPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService,
    private cohorteService: CohorteService,
    private departementService: DepartementService,
    private router: Router,
    
  ) {
    this.editForm = this.fb.group({
      nom: ['', [Validators.pattern('^[a-zA-Zà-üÀ-Ü ]+$')]],
      prenom: ['', [Validators.pattern('^[a-zA-Zà-üÀ-Ü ]+$')]],
      email: ['', [Validators.email]],
      adresse: [''],
      telephone: ['', this.telephoneValidator()],
      fonction: [''],
      photo: [''],
      ancien_mot_de_passe: [''],
      mot_de_passe: [''],
      departement: [''],
      cohorte: ['']
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.utilisateurService.getUtilisateurById(userId).subscribe(user => {
        this.editForm.patchValue(user);
        this.fonction = user.fonction;
        this.updatePasswordControls();
      });
    }

    // Récupérer les départements
    this.departementService.getDepartements().subscribe(departements => {
      this.departements = departements;
    });

    // Récupérer les cohortes
    this.cohorteService.getCohortes().subscribe(cohortes => {
      this.cohortes = cohortes;
    });
  }

  onFonctionChange() {
    this.fonction = this.editForm.get('fonction')?.value;
    this.showNextStep = true;
    this.updatePasswordControls();
  }

  nextStep() {
    if (this.editForm.valid) {
      this.showNextStep = true;
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        const formValue = this.editForm.value;
        if (this.fonction === 'apprenant' || this.fonction === 'employer') {
          delete formValue.ancien_mot_de_passe;
          delete formValue.mot_de_passe;
        }
        this.utilisateurService.updateUtilisateur(userId, formValue).subscribe(response => {
          console.log('Utilisateur mis à jour avec succès', response);
          this.showSuccessModal();  // Afficher le modal après la mise à jour réussie
        });
      }
    }
  }
  
  showSuccessModal() {
    // Afficher le modal de confirmation
    const modal = document.getElementById('updateModal') as any;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  
    // Attendre 5 secondes, puis rediriger vers la page utilisateur
    setTimeout(() => {
      modalInstance.hide();  // Masquer le modal
      this.redirectToUtilisateur();  // Rediriger vers la page utilisateur
    }, 5000);  // 5000 ms = 5 secondes
  }
  
  redirectToUtilisateur() {
    // Rediriger vers la page utilisateur
    this.router.navigate(['/utilisateur']);  // Remplacez par l'URL de la page utilisateur
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

  updatePasswordControls() {
    const ancienMotDePasseControl = this.editForm.get('ancien_mot_de_passe');
    const motDePasseControl = this.editForm.get('mot_de_passe');

    if (this.fonction === 'apprenant' || this.fonction === 'employer') {
      ancienMotDePasseControl?.clearValidators();
      ancienMotDePasseControl?.updateValueAndValidity();
      motDePasseControl?.clearValidators();
      motDePasseControl?.updateValueAndValidity();
    } else {
      ancienMotDePasseControl?.setValidators([Validators.required]);
      ancienMotDePasseControl?.updateValueAndValidity();
      motDePasseControl?.setValidators([Validators.minLength(6), this.passwordStrengthValidator()]);
      motDePasseControl?.updateValueAndValidity();
    }
  }

  toggleAncienPasswordVisibility() {
    this.showAncienPassword = !this.showAncienPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
}
