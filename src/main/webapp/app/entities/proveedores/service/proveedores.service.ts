import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProveedores, NewProveedores } from '../proveedores.model';

export type PartialUpdateProveedores = Partial<IProveedores> & Pick<IProveedores, 'id'>;

export type EntityResponseType = HttpResponse<IProveedores>;
export type EntityArrayResponseType = HttpResponse<IProveedores[]>;

@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/proveedores');

  create(proveedores: NewProveedores): Observable<EntityResponseType> {
    return this.http.post<IProveedores>(this.resourceUrl, proveedores, { observe: 'response' });
  }

  update(proveedores: IProveedores): Observable<EntityResponseType> {
    return this.http.put<IProveedores>(`${this.resourceUrl}/${this.getProveedoresIdentifier(proveedores)}`, proveedores, {
      observe: 'response',
    });
  }

  partialUpdate(proveedores: PartialUpdateProveedores): Observable<EntityResponseType> {
    return this.http.patch<IProveedores>(`${this.resourceUrl}/${this.getProveedoresIdentifier(proveedores)}`, proveedores, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProveedores>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProveedores[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProveedoresIdentifier(proveedores: Pick<IProveedores, 'id'>): number {
    return proveedores.id;
  }

  compareProveedores(o1: Pick<IProveedores, 'id'> | null, o2: Pick<IProveedores, 'id'> | null): boolean {
    return o1 && o2 ? this.getProveedoresIdentifier(o1) === this.getProveedoresIdentifier(o2) : o1 === o2;
  }

  addProveedoresToCollectionIfMissing<Type extends Pick<IProveedores, 'id'>>(
    proveedoresCollection: Type[],
    ...proveedoresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const proveedores: Type[] = proveedoresToCheck.filter(isPresent);
    if (proveedores.length > 0) {
      const proveedoresCollectionIdentifiers = proveedoresCollection.map(proveedoresItem => this.getProveedoresIdentifier(proveedoresItem));
      const proveedoresToAdd = proveedores.filter(proveedoresItem => {
        const proveedoresIdentifier = this.getProveedoresIdentifier(proveedoresItem);
        if (proveedoresCollectionIdentifiers.includes(proveedoresIdentifier)) {
          return false;
        }
        proveedoresCollectionIdentifiers.push(proveedoresIdentifier);
        return true;
      });
      return [...proveedoresToAdd, ...proveedoresCollection];
    }
    return proveedoresCollection;
  }
}
