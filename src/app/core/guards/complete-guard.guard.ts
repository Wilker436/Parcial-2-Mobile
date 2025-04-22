import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFlowService } from '../services/auth-flow.service';

export const completeGuard: CanActivateFn = (route, state) => {

  const authFlowService = inject(AuthFlowService);
  const router = inject(Router);


  if (authFlowService.isFromGoogleLogin()) {
    authFlowService.clear(); // Para evitar reentrada
    return true;
  }

  router.navigate(['/']);
  return false;

};
