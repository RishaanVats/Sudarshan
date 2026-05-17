import { Injectable, computed, signal } from '@angular/core';
import { CurrentUser, Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly currentUser = signal<CurrentUser>({
    id: 1,
    name: 'Rishu',
    role: Role.User
  });

  readonly currentRole = computed(() => this.currentUser().role);

  readonly permissions = computed(() => ({
    isAdmin: this.currentRole() === Role.Admin,
    isUser: [Role.Admin, Role.User].includes(this.currentRole()),
    isGuest: this.currentRole() === Role.Guest
  }));

  switchRole(role: Role): void {
    this.currentUser.update(user => ({
      ...user,
      role
    }));
  }

  hasRole(roles: Role[]): boolean {
    return roles.includes(this.currentRole());
  }
}
