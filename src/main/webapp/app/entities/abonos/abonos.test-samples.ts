import { IAbonos, NewAbonos } from './abonos.model';

export const sampleWithRequiredData: IAbonos = {
  id: 15805,
  saldoAnterior: 28025,
  abono: 12039,
};

export const sampleWithPartialData: IAbonos = {
  id: 24320,
  saldoAnterior: 6526,
  abono: 1601,
};

export const sampleWithFullData: IAbonos = {
  id: 19846,
  saldoAnterior: 30215,
  abono: 16279,
  nuevoSaldo: 17443,
};

export const sampleWithNewData: NewAbonos = {
  saldoAnterior: 12027,
  abono: 3684,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
