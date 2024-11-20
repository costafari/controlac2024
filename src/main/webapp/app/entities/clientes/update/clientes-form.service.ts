import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IClientes, NewClientes } from '../clientes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClientes for edit and NewClientesFormGroupInput for create.
 */
type ClientesFormGroupInput = IClientes | PartialWithRequiredKeyOf<NewClientes>;

type ClientesFormDefaults = Pick<NewClientes, 'id' | 'activo'>;

type ClientesFormGroupContent = {
  id: FormControl<IClientes['id'] | NewClientes['id']>;
  activo: FormControl<IClientes['activo']>;
  apellidos: FormControl<IClientes['apellidos']>;
  direcion: FormControl<IClientes['direcion']>;
  email: FormControl<IClientes['email']>;
  nombreContacto: FormControl<IClientes['nombreContacto']>;
  nombreEmpresa: FormControl<IClientes['nombreEmpresa']>;
  nombres: FormControl<IClientes['nombres']>;
  notas: FormControl<IClientes['notas']>;
  sitioWeb: FormControl<IClientes['sitioWeb']>;
  telefonoFijo: FormControl<IClientes['telefonoFijo']>;
  telefonoFijo2: FormControl<IClientes['telefonoFijo2']>;
  telefonoMovil: FormControl<IClientes['telefonoMovil']>;
  telefonoMovil2: FormControl<IClientes['telefonoMovil2']>;
};

export type ClientesFormGroup = FormGroup<ClientesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientesFormService {
  createClientesFormGroup(clientes: ClientesFormGroupInput = { id: null }): ClientesFormGroup {
    const clientesRawValue = {
      ...this.getFormDefaults(),
      ...clientes,
    };
    return new FormGroup<ClientesFormGroupContent>({
      id: new FormControl(
        { value: clientesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      activo: new FormControl(clientesRawValue.activo),
      apellidos: new FormControl(clientesRawValue.apellidos),
      direcion: new FormControl(clientesRawValue.direcion),
      email: new FormControl(clientesRawValue.email),
      nombreContacto: new FormControl(clientesRawValue.nombreContacto),
      nombreEmpresa: new FormControl(clientesRawValue.nombreEmpresa),
      nombres: new FormControl(clientesRawValue.nombres),
      notas: new FormControl(clientesRawValue.notas),
      sitioWeb: new FormControl(clientesRawValue.sitioWeb),
      telefonoFijo: new FormControl(clientesRawValue.telefonoFijo),
      telefonoFijo2: new FormControl(clientesRawValue.telefonoFijo2),
      telefonoMovil: new FormControl(clientesRawValue.telefonoMovil),
      telefonoMovil2: new FormControl(clientesRawValue.telefonoMovil2),
    });
  }

  getClientes(form: ClientesFormGroup): IClientes | NewClientes {
    return form.getRawValue() as IClientes | NewClientes;
  }

  resetForm(form: ClientesFormGroup, clientes: ClientesFormGroupInput): void {
    const clientesRawValue = { ...this.getFormDefaults(), ...clientes };
    form.reset(
      {
        ...clientesRawValue,
        id: { value: clientesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientesFormDefaults {
    return {
      id: null,
      activo: false,
    };
  }
}
