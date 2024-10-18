import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILotes } from '../lotes.model';
import { LotesService } from '../service/lotes.service';

const lotesResolve = (route: ActivatedRouteSnapshot): Observable<null | ILotes> => {
  const id = route.params.id;
  if (id) {
    return inject(LotesService)
      .find(id)
      .pipe(
        mergeMap((lotes: HttpResponse<ILotes>) => {
          if (lotes.body) {
            return of(lotes.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default lotesResolve;
