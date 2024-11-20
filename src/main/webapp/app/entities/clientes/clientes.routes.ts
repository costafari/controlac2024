import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClientesResolve from './route/clientes-routing-resolve.service';

const clientesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/clientes.component').then(m => m.ClientesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/clientes-detail.component').then(m => m.ClientesDetailComponent),
    resolve: {
      clientes: ClientesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/clientes-update.component').then(m => m.ClientesUpdateComponent),
    resolve: {
      clientes: ClientesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/clientes-update.component').then(m => m.ClientesUpdateComponent),
    resolve: {
      clientes: ClientesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clientesRoute;
