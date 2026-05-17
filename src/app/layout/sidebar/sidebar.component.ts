import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HostBinding } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/role.model';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HasRoleDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  readonly auth = inject(AuthService);
  readonly roles = Role;

  currYear = new Date().getFullYear(); // Current year for Copyright label

  @HostBinding('class.collapsed') get isCollapsed() {
    return this.collapsed;
  }
}
