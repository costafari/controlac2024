import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbonos, NewAbonos } from '../abonos.model';

export type PartialUpdateAbonos = Partial<IAbonos> & Pick<IAbonos, 'id'>;

export type EntityResponseType = HttpResponse<IAbonos>;
export type EntityArrayResponseType = HttpResponse<IAbonos[]>;

@Injectable({ providedIn: 'root' })
export class AbonosService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abonos');

  create(abonos: NewAbonos): Observable<EntityResponseType> {
    return this.http.post<IAbonos>(this.resourceUrl, abonos, { observe: 'response' });
  }

  update(abonos: IAbonos): Observable<EntityResponseType> {
    return this.http.put<IAbonos>(`${this.resourceUrl}/${this.getAbonosIdentifier(abonos)}`, abonos, { observe: 'response' });
  }

  partialUpdate(abonos: PartialUpdateAbonos): Observable<EntityResponseType> {
    return this.http.patch<IAbonos>(`${this.resourceUrl}/${this.getAbonosIdentifier(abonos)}`, abonos, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbonos>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbonos[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAbonosIdentifier(abonos: Pick<IAbonos, 'id'>): number {
    return abonos.id;
  }

  compareAbonos(o1: Pick<IAbonos, 'id'> | null, o2: Pick<IAbonos, 'id'> | null): boolean {
    return o1 && o2 ? this.getAbonosIdentifier(o1) === this.getAbonosIdentifier(o2) : o1 === o2;
  }

  addAbonosToCollectionIfMissing<Type extends Pick<IAbonos, 'id'>>(
    abonosCollection: Type[],
    ...abonosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const abonos: Type[] = abonosToCheck.filter(isPresent);
    if (abonos.length > 0) {
      const abonosCollectionIdentifiers = abonosCollection.map(abonosItem => this.getAbonosIdentifier(abonosItem));
      const abonosToAdd = abonos.filter(abonosItem => {
        const abonosIdentifier = this.getAbonosIdentifier(abonosItem);
        if (abonosCollectionIdentifiers.includes(abonosIdentifier)) {
          return false;
        }
        abonosCollectionIdentifiers.push(abonosIdentifier);
        return true;
      });
      return [...abonosToAdd, ...abonosCollection];
    }
    return abonosCollection;
  }
}
