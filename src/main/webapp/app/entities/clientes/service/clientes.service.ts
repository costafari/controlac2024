import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientes, NewClientes } from '../clientes.model';

export type PartialUpdateClientes = Partial<IClientes> & Pick<IClientes, 'id'>;

export type EntityResponseType = HttpResponse<IClientes>;
export type EntityArrayResponseType = HttpResponse<IClientes[]>;

@Injectable({ providedIn: 'root' })
export class ClientesService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clientes');

  create(clientes: NewClientes): Observable<EntityResponseType> {
    return this.http.post<IClientes>(this.resourceUrl, clientes, { observe: 'response' });
  }

  update(clientes: IClientes): Observable<EntityResponseType> {
    return this.http.put<IClientes>(`${this.resourceUrl}/${this.getClientesIdentifier(clientes)}`, clientes, { observe: 'response' });
  }

  partialUpdate(clientes: PartialUpdateClientes): Observable<EntityResponseType> {
    return this.http.patch<IClientes>(`${this.resourceUrl}/${this.getClientesIdentifier(clientes)}`, clientes, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClientes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClientes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientesIdentifier(clientes: Pick<IClientes, 'id'>): number {
    return clientes.id;
  }

  compareClientes(o1: Pick<IClientes, 'id'> | null, o2: Pick<IClientes, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientesIdentifier(o1) === this.getClientesIdentifier(o2) : o1 === o2;
  }

  addClientesToCollectionIfMissing<Type extends Pick<IClientes, 'id'>>(
    clientesCollection: Type[],
    ...clientesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientes: Type[] = clientesToCheck.filter(isPresent);
    if (clientes.length > 0) {
      const clientesCollectionIdentifiers = clientesCollection.map(clientesItem => this.getClientesIdentifier(clientesItem));
      const clientesToAdd = clientes.filter(clientesItem => {
        const clientesIdentifier = this.getClientesIdentifier(clientesItem);
        if (clientesCollectionIdentifiers.includes(clientesIdentifier)) {
          return false;
        }
        clientesCollectionIdentifiers.push(clientesIdentifier);
        return true;
      });
      return [...clientesToAdd, ...clientesCollection];
    }
    return clientesCollection;
  }
}
