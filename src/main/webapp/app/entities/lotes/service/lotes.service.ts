import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILotes, NewLotes } from '../lotes.model';

export type PartialUpdateLotes = Partial<ILotes> & Pick<ILotes, 'id'>;

type RestOf<T extends ILotes | NewLotes> = Omit<T, 'fechaEntrada'> & {
  fechaEntrada?: string | null;
};

export type RestLotes = RestOf<ILotes>;

export type NewRestLotes = RestOf<NewLotes>;

export type PartialUpdateRestLotes = RestOf<PartialUpdateLotes>;

export type EntityResponseType = HttpResponse<ILotes>;
export type EntityArrayResponseType = HttpResponse<ILotes[]>;

@Injectable({ providedIn: 'root' })
export class LotesService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lotes');

  create(lotes: NewLotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lotes);
    return this.http.post<RestLotes>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(lotes: ILotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lotes);
    return this.http
      .put<RestLotes>(`${this.resourceUrl}/${this.getLotesIdentifier(lotes)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(lotes: PartialUpdateLotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lotes);
    return this.http
      .patch<RestLotes>(`${this.resourceUrl}/${this.getLotesIdentifier(lotes)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLotes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLotes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLotesIdentifier(lotes: Pick<ILotes, 'id'>): number {
    return lotes.id;
  }

  compareLotes(o1: Pick<ILotes, 'id'> | null, o2: Pick<ILotes, 'id'> | null): boolean {
    return o1 && o2 ? this.getLotesIdentifier(o1) === this.getLotesIdentifier(o2) : o1 === o2;
  }

  addLotesToCollectionIfMissing<Type extends Pick<ILotes, 'id'>>(
    lotesCollection: Type[],
    ...lotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lotes: Type[] = lotesToCheck.filter(isPresent);
    if (lotes.length > 0) {
      const lotesCollectionIdentifiers = lotesCollection.map(lotesItem => this.getLotesIdentifier(lotesItem));
      const lotesToAdd = lotes.filter(lotesItem => {
        const lotesIdentifier = this.getLotesIdentifier(lotesItem);
        if (lotesCollectionIdentifiers.includes(lotesIdentifier)) {
          return false;
        }
        lotesCollectionIdentifiers.push(lotesIdentifier);
        return true;
      });
      return [...lotesToAdd, ...lotesCollection];
    }
    return lotesCollection;
  }

  protected convertDateFromClient<T extends ILotes | NewLotes | PartialUpdateLotes>(lotes: T): RestOf<T> {
    return {
      ...lotes,
      fechaEntrada: lotes.fechaEntrada?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restLotes: RestLotes): ILotes {
    return {
      ...restLotes,
      fechaEntrada: restLotes.fechaEntrada ? dayjs(restLotes.fechaEntrada) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLotes>): HttpResponse<ILotes> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLotes[]>): HttpResponse<ILotes[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
