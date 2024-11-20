import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDetalles, NewDetalles } from '../detalles.model';

export type PartialUpdateDetalles = Partial<IDetalles> & Pick<IDetalles, 'id'>;

export type EntityResponseType = HttpResponse<IDetalles>;
export type EntityArrayResponseType = HttpResponse<IDetalles[]>;

@Injectable({ providedIn: 'root' })
export class DetallesService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/detalles');

  create(detalles: NewDetalles): Observable<EntityResponseType> {
    return this.http.post<IDetalles>(this.resourceUrl, detalles, { observe: 'response' });
  }

  update(detalles: IDetalles): Observable<EntityResponseType> {
    return this.http.put<IDetalles>(`${this.resourceUrl}/${this.getDetallesIdentifier(detalles)}`, detalles, { observe: 'response' });
  }

  partialUpdate(detalles: PartialUpdateDetalles): Observable<EntityResponseType> {
    return this.http.patch<IDetalles>(`${this.resourceUrl}/${this.getDetallesIdentifier(detalles)}`, detalles, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDetalles>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDetalles[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDetallesIdentifier(detalles: Pick<IDetalles, 'id'>): number {
    return detalles.id;
  }

  compareDetalles(o1: Pick<IDetalles, 'id'> | null, o2: Pick<IDetalles, 'id'> | null): boolean {
    return o1 && o2 ? this.getDetallesIdentifier(o1) === this.getDetallesIdentifier(o2) : o1 === o2;
  }

  addDetallesToCollectionIfMissing<Type extends Pick<IDetalles, 'id'>>(
    detallesCollection: Type[],
    ...detallesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const detalles: Type[] = detallesToCheck.filter(isPresent);
    if (detalles.length > 0) {
      const detallesCollectionIdentifiers = detallesCollection.map(detallesItem => this.getDetallesIdentifier(detallesItem));
      const detallesToAdd = detalles.filter(detallesItem => {
        const detallesIdentifier = this.getDetallesIdentifier(detallesItem);
        if (detallesCollectionIdentifiers.includes(detallesIdentifier)) {
          return false;
        }
        detallesCollectionIdentifiers.push(detallesIdentifier);
        return true;
      });
      return [...detallesToAdd, ...detallesCollection];
    }
    return detallesCollection;
  }
}
