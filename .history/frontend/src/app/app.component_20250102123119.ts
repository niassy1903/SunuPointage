import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; // Ajout du CommonModule pour *ngIf
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showLayout = true; // Contrôle l'affichage du header et du sidebar

  constructor(private router: Router) {
    // Détection des changements de route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Masquer le layout sur la page de connexion
        this.showLayout = event.url !== '/' && event.url !== '/login';
      }
    });
  }
}