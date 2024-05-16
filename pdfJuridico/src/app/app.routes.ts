import { Routes } from '@angular/router';
import { FilesComponent } from './views/files/files.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'files',
    component: FilesComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
