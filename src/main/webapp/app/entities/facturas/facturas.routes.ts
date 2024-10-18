import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import FacturasResolve from './route/facturas-routing-resolve.service';

const facturasRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/facturas.component').then(m => m.FacturasComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/facturas-detail.component').then(m => m.FacturasDetailComponent),
    resolve: {
      facturas: FacturasResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/facturas-update.component').then(m => m.FacturasUpdateComponent),
    resolve: {
      facturas: FacturasResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/facturas-update.component').then(m => m.FacturasUpdateComponent),
    resolve: {
      facturas: FacturasResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default facturasRoute;
