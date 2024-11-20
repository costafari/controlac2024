import { IFacturas } from 'app/entities/facturas/facturas.model';

export interface IAbonos {
  id: number;
  saldoAnterior?: number | null;
  abono?: number | null;
  nuevoSaldo?: number | null;
  facturas?: IFacturas | null;
}

export type NewAbonos = Omit<IAbonos, 'id'> & { id: null };
