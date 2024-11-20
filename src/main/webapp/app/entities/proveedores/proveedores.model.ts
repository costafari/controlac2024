export interface IProveedores {
  id: number;
  direccion?: string | null;
  nombreContacto?: string | null;
  nombreEmpresa?: string | null;
  notas?: string | null;
  sitioWeb?: string | null;
  telefonoFijo?: number | null;
  telefonoFijo2?: number | null;
  telefonoMovil?: number | null;
  telefonoMovil2?: number | null;
}

export type NewProveedores = Omit<IProveedores, 'id'> & { id: null };
