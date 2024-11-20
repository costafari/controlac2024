import dayjs from 'dayjs/esm';

import { ILotes, NewLotes } from './lotes.model';

export const sampleWithRequiredData: ILotes = {
  id: 32595,
};

export const sampleWithPartialData: ILotes = {
  id: 31662,
  cantidad: 5396,
};

export const sampleWithFullData: ILotes = {
  id: 11008,
  cantidad: 9261,
  fechaEntrada: dayjs('2024-10-17'),
  lote: 'desecrate',
};

export const sampleWithNewData: NewLotes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
