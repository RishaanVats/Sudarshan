import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/role.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  isMenuCollapsed = true; // Default to closed

  constructor(private router: Router) {
    // Listen for successful navigation and collapse the menu
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isMenuCollapsed = true;
    });
  }

  readonly auth = inject(AuthService);
  readonly roles = Role;

  changeRole(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as Role;
    this.auth.switchRole(role);
  }

  // onToggle() {
  //   this.toggle.emit();
  // }
}
