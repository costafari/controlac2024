import dayjs from 'dayjs/esm';
import { IClientes } from 'app/entities/clientes/clientes.model';
import { ILotes } from 'app/entities/lotes/lotes.model';
import { IDetalles } from 'app/entities/detalles/detalles.model';

export interface IFacturas {
  id: number;
  numeroFactura?: number | null;
  fechaFactura?: dayjs.Dayjs | null;
  condicionPago?: boolean | null;
  clientes?: IClientes | null;
  lotes?: ILotes | null;
  detalles?: IDetalles | null;
}

export type NewFacturas = Omit<IFacturas, 'id'> & { id: null };
