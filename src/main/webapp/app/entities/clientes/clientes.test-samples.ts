import { IClientes, NewClientes } from './clientes.model';

export const sampleWithRequiredData: IClientes = {
  id: 2586,
};

export const sampleWithPartialData: IClientes = {
  id: 3947,
  activo: false,
  apellidos: 'gosh',
  direcion: 'the rudely yum',
  nombreContacto: 'outrun dutiful and',
  nombreEmpresa: 'absent provision whereas',
  nombres: 'how blah openly',
  sitioWeb: 'onto bludgeon',
};

export const sampleWithFullData: IClientes = {
  id: 10105,
  activo: false,
  apellidos: 'courtroom opposite',
  direcion: 'issue',
  email: 'Sancho.PreciadoJurado@gmail.com',
  nombreContacto: 'knottily small',
  nombreEmpresa: 'yowza',
  nombres: 'iterate er converse',
  notas: 'almost qua soliloquy',
  sitioWeb: 'rapidly airport easily',
  telefonoFijo: 18801,
  telefonoFijo2: 1690,
  telefonoMovil: 15094,
  telefonoMovil2: 25227,
};

export const sampleWithNewData: NewClientes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
