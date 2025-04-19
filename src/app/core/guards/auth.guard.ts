import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(authService.getAuth(), (firebaseUser) => {
      unsubscribe(); // Nos desuscribimos inmediatamente después de obtener el resultado
      resolve(firebaseUser);
    });
  });

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
