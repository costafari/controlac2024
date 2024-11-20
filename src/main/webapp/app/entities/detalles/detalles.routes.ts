import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import DetallesResolve from './route/detalles-routing-resolve.service';

const detallesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/detalles.component').then(m => m.DetallesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/detalles-detail.component').then(m => m.DetallesDetailComponent),
    resolve: {
      detalles: DetallesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/detalles-update.component').then(m => m.DetallesUpdateComponent),
    resolve: {
      detalles: DetallesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/detalles-update.component').then(m => m.DetallesUpdateComponent),
    resolve: {
      detalles: DetallesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default detallesRoute;
