import { Routes } from '@angular/router';

export const routes: Routes = [

   {
    path: 'login',
    loadComponent: () => import('./views/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'home/:id',
    loadComponent: () => import('./views/user-detail/user-detail.page').then((m) => m.UserDetailPage),
  },
   {
    path: 'ver-usuario/:id', 
    loadComponent: () => import('./views/ver-usuario/ver-usuario.component').then(m => m.VerUsuarioComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
