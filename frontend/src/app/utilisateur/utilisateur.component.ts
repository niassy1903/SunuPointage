import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service'; // Importation du service
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DepartementService } from '../departement.service';
import { CohorteService } from '../cohorte.service';

interface User {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  matricule: string;
  address: string;
  selected?: boolean; // Ajout de la propriété selected pour gérer la sélection
}

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, FormsModule, HttpClientModule],
  providers: [UtilisateurService, CohorteService, DepartementService]
})
export class UtilisateurComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private utilisateurService: UtilisateurService) {}

  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  selectAll: boolean = false;
  selectedUsersCount: number = 0;

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
          status: user.fonction,
          email: user.email,
          matricule: user.matricule,
          address: user.adresse
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
    // Logique pour éditer un utilisateur
  }

  // Ajout d'un utilisateur
  addUser() {
    this.router.navigate(['/inscription']);
  }

  // Suppression d'un utilisateur
  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      this.utilisateurService.deleteUtilisateur(user.id).subscribe(
        () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          alert('Utilisateur supprimé avec succès.');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          alert('Une erreur est survenue lors de la suppression.');
        }
      );
    }
  }

  // Blocage d'un utilisateur
  blockUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir bloquer ${user.firstName} ${user.lastName} ?`)) {
      this.utilisateurService.blockUtilisateur(user.id).subscribe(
        () => {
          user.status = 'Bloqué';
          alert('Utilisateur bloqué avec succès.');
        },
        (error) => {
          console.error('Erreur lors du blocage de l\'utilisateur :', error);
          alert('Une erreur est survenue lors du blocage.');
        }
      );
    }
  }

  // Suppression des utilisateurs sélectionnés
  deleteSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert('Aucun utilisateur sélectionné.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?')) {
      selectedUsers.forEach(user => {
        this.utilisateurService.deleteUtilisateur(user.id).subscribe(
          () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          },
          (error) => {
            console.error('Erreur lors de la suppression des utilisateurs :', error);
            alert('Une erreur est survenue lors de la suppression.');
          }
        );
      });
      alert('Utilisateurs supprimés avec succès.');
    }
  }

  // Blocage des utilisateurs sélectionnés
  blockSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert('Aucun utilisateur sélectionné.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir bloquer les utilisateurs sélectionnés ?')) {
      selectedUsers.forEach(user => {
        this.utilisateurService.blockUtilisateur(user.id).subscribe(
          () => {
            user.status = 'Bloqué';
          },
          (error) => {
            console.error('Erreur lors du blocage des utilisateurs :', error);
            alert('Une erreur est survenue lors du blocage.');
          }
        );
      });
      alert('Utilisateurs bloqués avec succès.');
    }
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

  // Exporter les utilisateurs en CSV
  exportCSV() {
    // Logique pour exporter les utilisateurs en CSV
  }
}
