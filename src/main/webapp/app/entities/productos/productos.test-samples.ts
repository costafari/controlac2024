import { IProductos, NewProductos } from './productos.model';

export const sampleWithRequiredData: IProductos = {
  id: 5485,
};

export const sampleWithPartialData: IProductos = {
  id: 21378,
};

export const sampleWithFullData: IProductos = {
  id: 7565,
  descipcion: 'spew',
  nombre: 'boohoo',
  notas: 'rule why mid',
};

export const sampleWithNewData: NewProductos = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
