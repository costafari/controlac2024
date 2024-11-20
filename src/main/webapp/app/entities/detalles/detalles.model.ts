export interface IDetalles {
  id: number;
  cantidad?: number | null;
  total?: number | null;
}

export type NewDetalles = Omit<IDetalles, 'id'> & { id: null };
