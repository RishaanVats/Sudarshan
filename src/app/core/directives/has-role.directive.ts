import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  input
} from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/role.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  readonly appHasRole = input.required<Role[]>();

  constructor() {
    effect(() => {
      this.viewContainer.clear();

      if (this.auth.hasRole(this.appHasRole())) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
