import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  isMenuCollapsed = true; // Default to closed
  
  constructor(private router: Router) {
    // Listen for successful navigation and collapse the menu
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMenuCollapsed = true;
    });
  }
  // onToggle() {
  //   this.toggle.emit();
  // }
}
