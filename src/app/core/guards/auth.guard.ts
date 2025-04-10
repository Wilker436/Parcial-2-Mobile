import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated();
  

  if(isAuthenticated){
  return true;
  }else{
    router.navigate(['/login']);
    return false;
  }


};
