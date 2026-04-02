import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HostBinding } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  currYear = new Date().getFullYear();  // Current year for Copyright label

  @HostBinding('class.collapsed') get isCollapsed() {
  return this.collapsed;
}
}
