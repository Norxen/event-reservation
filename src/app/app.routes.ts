import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./core/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'billboard',
        pathMatch: 'full',
      },
      {
        path: 'billboard',
        loadComponent: () =>
          import('./pages/billboard/billboard.component').then(
            (m) => m.BillboardComponent
          ),
      },
      {
        path: 'event/:id',
        loadComponent: () =>
          import('./pages/event-details/event-details.component').then(
            (m) => m.EventDetailsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'events',
    pathMatch: 'full',
  },
];
