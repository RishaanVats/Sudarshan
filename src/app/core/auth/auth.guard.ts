import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Role } from './role.model';

export const authGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasRole(allowedRoles)
      ? true
      : router.createUrlTree(['/dashboard']);
  };
};
