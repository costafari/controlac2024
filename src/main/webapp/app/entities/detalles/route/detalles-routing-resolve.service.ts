import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDetalles } from '../detalles.model';
import { DetallesService } from '../service/detalles.service';

const detallesResolve = (route: ActivatedRouteSnapshot): Observable<null | IDetalles> => {
  const id = route.params.id;
  if (id) {
    return inject(DetallesService)
      .find(id)
      .pipe(
        mergeMap((detalles: HttpResponse<IDetalles>) => {
          if (detalles.body) {
            return of(detalles.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default detallesResolve;
