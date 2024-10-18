import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AbonosResolve from './route/abonos-routing-resolve.service';

const abonosRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/abonos.component').then(m => m.AbonosComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/abonos-detail.component').then(m => m.AbonosDetailComponent),
    resolve: {
      abonos: AbonosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/abonos-update.component').then(m => m.AbonosUpdateComponent),
    resolve: {
      abonos: AbonosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/abonos-update.component').then(m => m.AbonosUpdateComponent),
    resolve: {
      abonos: AbonosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default abonosRoute;
