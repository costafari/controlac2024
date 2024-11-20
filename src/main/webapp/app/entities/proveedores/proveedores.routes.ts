import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ProveedoresResolve from './route/proveedores-routing-resolve.service';

const proveedoresRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/proveedores.component').then(m => m.ProveedoresComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/proveedores-detail.component').then(m => m.ProveedoresDetailComponent),
    resolve: {
      proveedores: ProveedoresResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/proveedores-update.component').then(m => m.ProveedoresUpdateComponent),
    resolve: {
      proveedores: ProveedoresResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/proveedores-update.component').then(m => m.ProveedoresUpdateComponent),
    resolve: {
      proveedores: ProveedoresResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default proveedoresRoute;
