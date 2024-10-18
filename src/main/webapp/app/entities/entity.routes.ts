import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'clientes',
    data: { pageTitle: 'Clientes' },
    loadChildren: () => import('./clientes/clientes.routes'),
  },
  {
    path: 'lotes',
    data: { pageTitle: 'Lotes' },
    loadChildren: () => import('./lotes/lotes.routes'),
  },
  {
    path: 'productos',
    data: { pageTitle: 'Productos' },
    loadChildren: () => import('./productos/productos.routes'),
  },
  {
    path: 'proveedores',
    data: { pageTitle: 'Proveedores' },
    loadChildren: () => import('./proveedores/proveedores.routes'),
  },
  {
    path: 'facturas',
    data: { pageTitle: 'Facturas' },
    loadChildren: () => import('./facturas/facturas.routes'),
  },
  {
    path: 'detalles',
    data: { pageTitle: 'Detalles' },
    loadChildren: () => import('./detalles/detalles.routes'),
  },
  {
    path: 'abonos',
    data: { pageTitle: 'Abonos' },
    loadChildren: () => import('./abonos/abonos.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
