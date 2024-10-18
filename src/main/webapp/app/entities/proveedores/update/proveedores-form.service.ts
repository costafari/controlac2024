import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProveedores, NewProveedores } from '../proveedores.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProveedores for edit and NewProveedoresFormGroupInput for create.
 */
type ProveedoresFormGroupInput = IProveedores | PartialWithRequiredKeyOf<NewProveedores>;

type ProveedoresFormDefaults = Pick<NewProveedores, 'id'>;

type ProveedoresFormGroupContent = {
  id: FormControl<IProveedores['id'] | NewProveedores['id']>;
  direccion: FormControl<IProveedores['direccion']>;
  nombreContacto: FormControl<IProveedores['nombreContacto']>;
  nombreEmpresa: FormControl<IProveedores['nombreEmpresa']>;
  notas: FormControl<IProveedores['notas']>;
  sitioWeb: FormControl<IProveedores['sitioWeb']>;
  telefonoFijo: FormControl<IProveedores['telefonoFijo']>;
  telefonoFijo2: FormControl<IProveedores['telefonoFijo2']>;
  telefonoMovil: FormControl<IProveedores['telefonoMovil']>;
  telefonoMovil2: FormControl<IProveedores['telefonoMovil2']>;
};

export type ProveedoresFormGroup = FormGroup<ProveedoresFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProveedoresFormService {
  createProveedoresFormGroup(proveedores: ProveedoresFormGroupInput = { id: null }): ProveedoresFormGroup {
    const proveedoresRawValue = {
      ...this.getFormDefaults(),
      ...proveedores,
    };
    return new FormGroup<ProveedoresFormGroupContent>({
      id: new FormControl(
        { value: proveedoresRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      direccion: new FormControl(proveedoresRawValue.direccion),
      nombreContacto: new FormControl(proveedoresRawValue.nombreContacto),
      nombreEmpresa: new FormControl(proveedoresRawValue.nombreEmpresa),
      notas: new FormControl(proveedoresRawValue.notas),
      sitioWeb: new FormControl(proveedoresRawValue.sitioWeb),
      telefonoFijo: new FormControl(proveedoresRawValue.telefonoFijo),
      telefonoFijo2: new FormControl(proveedoresRawValue.telefonoFijo2),
      telefonoMovil: new FormControl(proveedoresRawValue.telefonoMovil),
      telefonoMovil2: new FormControl(proveedoresRawValue.telefonoMovil2),
    });
  }

  getProveedores(form: ProveedoresFormGroup): IProveedores | NewProveedores {
    return form.getRawValue() as IProveedores | NewProveedores;
  }

  resetForm(form: ProveedoresFormGroup, proveedores: ProveedoresFormGroupInput): void {
    const proveedoresRawValue = { ...this.getFormDefaults(), ...proveedores };
    form.reset(
      {
        ...proveedoresRawValue,
        id: { value: proveedoresRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProveedoresFormDefaults {
    return {
      id: null,
    };
  }
}
