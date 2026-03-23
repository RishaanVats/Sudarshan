import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
{
    path: '',
    component: LayoutComponent,   // 🔴 App shell
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'volunteers',
        loadComponent: () =>
          import('./features/volunteers/volunteers.component')
            .then(m => m.VolunteersComponent)
      },
      {
        path: 'booths',
        loadComponent: () =>
          import('./features/booths/booths.component')
            .then(m => m.BoothsComponent)
      },
      {
        path: 'intelligence',
        loadComponent: () =>
          import('./features/intelligence/intelligence.component')
            .then(m => m.IntelligenceComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Optional fallback
  {
    path: '**',
    redirectTo: ''
  }
];
