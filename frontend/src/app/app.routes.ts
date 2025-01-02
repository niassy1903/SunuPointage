import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PresenceComponent } from './presence/presence.component';
import { LoginComponent } from './login/login.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { DepartementComponent } from './departement/departement.component';
import { CohorteComponent } from './cohorte/cohorte.component';
import { HistoriqueComponent } from './historique/historique.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { EditComponent } from './edit/edit.component';
import { AddDepartementComponent } from './add-departement/add-departement.component';
import { DashboardVigileComponent } from './dashboard-vigile/dashboard-vigile.component';






export const routes: Routes = [
    {path: 'dashboard', component : DashboardComponent},
    {path: 'sidebar', component : SidebarComponent},
    {path: 'navebar',component: NavbarComponent},
    {path: 'presence',component: PresenceComponent},
    {path: 'login', component: LoginComponent},
    {path: 'utilisateur', component:UtilisateurComponent},
    {path: 'departement',component:DepartementComponent},
    {path: 'cohorte',component:CohorteComponent},
    {path: 'historique',component:HistoriqueComponent},
    {path: 'inscription',component:InscriptionComponent},
    { path: 'edit/:id', component: EditComponent },
    {path:'add-departement', component: AddDepartementComponent},
    {path:'dashboard-vigile', component: DashboardVigileComponent},


];
