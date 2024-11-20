import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProveedores } from '../proveedores.model';
import { ProveedoresService } from '../service/proveedores.service';

const proveedoresResolve = (route: ActivatedRouteSnapshot): Observable<null | IProveedores> => {
  const id = route.params.id;
  if (id) {
    return inject(ProveedoresService)
      .find(id)
      .pipe(
        mergeMap((proveedores: HttpResponse<IProveedores>) => {
          if (proveedores.body) {
            return of(proveedores.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default proveedoresResolve;
