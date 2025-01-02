import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service'; // Importation du service
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DepartementService } from '../departement.service';
import { CohorteService } from '../cohorte.service';
import * as Papa from 'papaparse'; // Importation de PapaParse pour lire le CSV


interface User {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  fonction: string;
  status: string;
  email: string;
  matricule: string;
  address: string;
  departement: string;
  cohorte: string;
  selected?: boolean; // Ajout de la propriété selected pour gérer la sélection
}

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css'],
  standalone: true,
  imports: [CommonModule,  FormsModule, HttpClientModule],
  providers: [UtilisateurService, CohorteService, DepartementService]
})
export class UtilisateurComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private utilisateurService: UtilisateurService) {}

  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 4;
  selectAll: boolean = false;
  selectedUsersCount: number = 0;
  userToDelete: User | null = null;
  userToBlock: User | null = null;

  ngOnInit() {
    // Appel du service pour récupérer les utilisateurs
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => {
        // Formater les données des utilisateurs
        this.users = data.map(user => ({
          id: user.id,
          photo: '/images/profil.png',
          firstName: user.nom,
          lastName: user.prenom,
          fonction: user.fonction,
          status: user.status,
          email: user.email,
          matricule: user.matricule,
          address: user.adresse,
          departement: user.departement, // Ajout de la propriété departement
          cohorte: user.cohorte // Ajout de la propriété cohorte
        }));
        // Mettre à jour la pagination
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  // Met à jour la pagination après un filtrage ou un changement de page
  updatePagination() {
    // Mettre à jour le nombre total de pages
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    // Mettre à jour les utilisateurs filtrés en fonction de la page actuelle
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredUsers = this.users.slice(start, end);
  }

  // Méthode de filtrage des utilisateurs
  filterUsers(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    // Filtrer les utilisateurs par prénom ou nom
    const filtered = this.users.filter(user =>
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase())
    );
    this.users = filtered; // Mettre à jour les utilisateurs avec le filtre
    this.currentPage = 1; // Réinitialiser la page à 1 après un filtre
    this.updatePagination(); // Recalcule la pagination
  }

  // Méthodes de navigation entre les pages
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredUsers = this.users.slice(start, end);
  }

  editUser(user: User) {
    this.router.navigate(['/edit', user.id]);
  }

  // Ajout d'un utilisateur
  addUser() {
    this.router.navigate(['/inscription']);
  }

  // Suppression d'un utilisateur
  setUserToDelete(user: User) {
    this.userToDelete = user;
  }

  confirmDeleteUser() {
    if (this.userToDelete) {
      this.utilisateurService.deleteUtilisateur(this.userToDelete.id).subscribe(
        () => {
          this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.userToDelete!.id);
          this.userToDelete = null;
          document.getElementById('deleteModal')?.click(); // Fermer le modal
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
      );
    }
  }

  // Blocage d'un utilisateur
  setUserToBlock(user: User) {
    this.userToBlock = user;
  }

  confirmBlockUser() {
    if (this.userToBlock !== null) { // Vérifie si userToBlock n'est pas null
      this.utilisateurService.blockUtilisateur(this.userToBlock.id).subscribe(
        () => {
          // Assurez-vous de ne pas obtenir une erreur en accédant à userToBlock
          if (this.userToBlock) {
            this.userToBlock.status = 'Bloqué';
          }
          this.userToBlock = null;
          document.getElementById('blockModal')?.click(); // Fermer le modal
        },
        (error) => {
          console.error('Erreur lors du blocage de l\'utilisateur :', error);
        }
      );
    } else {
      console.error('L\'utilisateur à bloquer est introuvable.');
    }
  }

  // Suppression des utilisateurs sélectionnés
  confirmDeleteSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      console.error('Aucun utilisateur sélectionné.');
      return;
    }
    selectedUsers.forEach(user => {
      this.utilisateurService.deleteUtilisateur(user.id).subscribe(
        () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
        },
        (error) => {
          console.error('Erreur lors de la suppression des utilisateurs :', error);
        }
      );
    });
    document.getElementById('deleteSelectedModal')?.click(); // Fermer le modal
  }

  // Blocage des utilisateurs sélectionnés
  confirmBlockSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      console.error('Aucun utilisateur sélectionné.');
      return;
    }
    selectedUsers.forEach(user => {
      this.utilisateurService.blockUtilisateur(user.id).subscribe(
        () => {
          user.status = 'Bloqué';
        },
        (error) => {
          console.error('Erreur lors du blocage des utilisateurs :', error);
        }
      );
    });
    document.getElementById('blockSelectedModal')?.click(); // Fermer le modal
  }

  // Sélectionner/désélectionner tous les utilisateurs
  toggleSelectAll() {
    this.filteredUsers.forEach(user => user.selected = this.selectAll);
    this.updateSelectedUsersCount();
  }

  // Mettre à jour le nombre d'utilisateurs sélectionnés
  toggleSelect(user: User) {
    this.selectAll = this.filteredUsers.every(user => user.selected);
    this.updateSelectedUsersCount();
  }

  updateSelectedUsersCount() {
    this.selectedUsersCount = this.filteredUsers.filter(user => user.selected).length;
  }

  // Méthode pour déclencher l'ouverture du sélecteur de fichiers
  triggerFileUpload() {
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Méthode pour gérer la sélection du fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readCSVFile(file);
    }
  }

  // Méthode pour lire et traiter le fichier CSV
  readCSVFile(file: File) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const usersFromCSV = results.data as User[];
        usersFromCSV.forEach(user => {
          this.utilisateurService.createUtilisateur(user).subscribe(
            (response) => {
              console.log('Utilisateur créé avec succès:', response);
              this.users.push(response);
              this.updatePagination();
            },
            (error) => {
              console.error('Erreur lors de la création de l\'utilisateur :', error);
            }
          );
        });
      },
      error: (error) => {
        console.error('Erreur lors de la lecture du fichier CSV:', error);
      }
    });
  }
}
