import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LotesResolve from './route/lotes-routing-resolve.service';

const lotesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/lotes.component').then(m => m.LotesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/lotes-detail.component').then(m => m.LotesDetailComponent),
    resolve: {
      lotes: LotesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/lotes-update.component').then(m => m.LotesUpdateComponent),
    resolve: {
      lotes: LotesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/lotes-update.component').then(m => m.LotesUpdateComponent),
    resolve: {
      lotes: LotesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default lotesRoute;
