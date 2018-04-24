import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { NavbarComponent } from './navbar/index';
import { GameComponent } from './game/index';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'game/:user', component: GameComponent },  
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);