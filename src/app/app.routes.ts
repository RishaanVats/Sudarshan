import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

import { authGuard } from './core/auth/auth.guard';
import { Role } from './core/auth/role.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout/layout.component').then((m) => m.LayoutComponent),
     // 🔴 App shell
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'volunteers',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/volunteers/volunteers.component').then((m) => m.VolunteersComponent),
      },
      {
        path: 'booths',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/booths/booths.component').then((m) => m.BoothsComponent),
      },
      {
        path: 'd2dOutreach',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/door-outreach/door-outreach').then((m) => m.DoorOutreach),
      },
      {
        path: 'voterAnalysis',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/voter-analysis/voter-analysis').then((m) => m.VoterAnalysis),
      },
      {
        path: 'influencerNetwork',
        canActivate: [authGuard([Role.Admin, Role.User])],
        loadComponent: () =>
          import('./features/influencer-network/influencer-network').then(
            (m) => m.InfluencerNetwork,
          ),
      },
      {
        path: 'intelligence',
        canActivate: [authGuard([Role.Admin])],
        loadComponent: () =>
          import('./features/intelligence/intelligence.component').then(
            (m) => m.IntelligenceComponent,
          ),
      },
      {
        path: 'warRoomReports',
        canActivate: [authGuard([Role.Admin])],
        loadComponent: () =>
          import('./features/war-room-reports/war-room-reports').then((m) => m.WarRoomReports),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Optional fallback
  {
    path: '**',
    redirectTo: '',
  },
];
