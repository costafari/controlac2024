import { IDetalles, NewDetalles } from './detalles.model';

export const sampleWithRequiredData: IDetalles = {
  id: 19012,
  cantidad: 18906,
};

export const sampleWithPartialData: IDetalles = {
  id: 5060,
  cantidad: 10494,
};

export const sampleWithFullData: IDetalles = {
  id: 2765,
  cantidad: 9413,
  total: 6084,
};

export const sampleWithNewData: NewDetalles = {
  cantidad: 2386,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
