export interface IClientes {
  id: number;
  activo?: boolean | null;
  apellidos?: string | null;
  direcion?: string | null;
  email?: string | null;
  nombreContacto?: string | null;
  nombreEmpresa?: string | null;
  nombres?: string | null;
  notas?: string | null;
  sitioWeb?: string | null;
  telefonoFijo?: number | null;
  telefonoFijo2?: number | null;
  telefonoMovil?: number | null;
  telefonoMovil2?: number | null;
}

export type NewClientes = Omit<IClientes, 'id'> & { id: null };
