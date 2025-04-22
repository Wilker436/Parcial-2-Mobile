import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { completeGuard } from './core/guards/complete-guard.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'add-contact',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/add-contact/add-contact.page').then( m => m.AddContactPage)
  },
  {
    path: 'complete-profile',
   /*  canActivate: [completeGuard], */
    loadComponent: () => import('./pages/complete-profile/complete-profile.page').then( m => m.CompleteProfilePage)
  },
];
