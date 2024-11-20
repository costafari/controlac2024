import { IProveedores, NewProveedores } from './proveedores.model';

export const sampleWithRequiredData: IProveedores = {
  id: 2662,
};

export const sampleWithPartialData: IProveedores = {
  id: 11186,
  direccion: 'thoughtfully',
  nombreContacto: 'pick within which',
  nombreEmpresa: 'derby',
  notas: 'hourly',
  sitioWeb: 'truthfully whether nougat',
  telefonoFijo: 17906,
  telefonoFijo2: 18688,
  telefonoMovil2: 18033,
};

export const sampleWithFullData: IProveedores = {
  id: 31000,
  direccion: 'before',
  nombreContacto: 'completion hence',
  nombreEmpresa: 'up over',
  notas: 'ack',
  sitioWeb: 'offset',
  telefonoFijo: 13886,
  telefonoFijo2: 29258,
  telefonoMovil: 20251,
  telefonoMovil2: 23941,
};

export const sampleWithNewData: NewProveedores = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
