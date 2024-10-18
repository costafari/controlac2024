import dayjs from 'dayjs/esm';

import { IFacturas, NewFacturas } from './facturas.model';

export const sampleWithRequiredData: IFacturas = {
  id: 4085,
  numeroFactura: 30949,
};

export const sampleWithPartialData: IFacturas = {
  id: 24844,
  numeroFactura: 14273,
  fechaFactura: dayjs('2024-10-17T23:33'),
  condicionPago: true,
};

export const sampleWithFullData: IFacturas = {
  id: 15476,
  numeroFactura: 14546,
  fechaFactura: dayjs('2024-10-17T08:40'),
  condicionPago: false,
};

export const sampleWithNewData: NewFacturas = {
  numeroFactura: 22549,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
