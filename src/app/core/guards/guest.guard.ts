import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // If the user is already logged in, redirect them away from the login page
    return router.parseUrl('/expired-courses'); 
  }

  // If not logged in, allow them to access the login page
  return true;
};
