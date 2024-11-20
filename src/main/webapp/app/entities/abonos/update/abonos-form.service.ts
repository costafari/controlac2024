import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAbonos, NewAbonos } from '../abonos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAbonos for edit and NewAbonosFormGroupInput for create.
 */
type AbonosFormGroupInput = IAbonos | PartialWithRequiredKeyOf<NewAbonos>;

type AbonosFormDefaults = Pick<NewAbonos, 'id'>;

type AbonosFormGroupContent = {
  id: FormControl<IAbonos['id'] | NewAbonos['id']>;
  saldoAnterior: FormControl<IAbonos['saldoAnterior']>;
  abono: FormControl<IAbonos['abono']>;
  nuevoSaldo: FormControl<IAbonos['nuevoSaldo']>;
  facturas: FormControl<IAbonos['facturas']>;
};

export type AbonosFormGroup = FormGroup<AbonosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AbonosFormService {
  createAbonosFormGroup(abonos: AbonosFormGroupInput = { id: null }): AbonosFormGroup {
    const abonosRawValue = {
      ...this.getFormDefaults(),
      ...abonos,
    };
    return new FormGroup<AbonosFormGroupContent>({
      id: new FormControl(
        { value: abonosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      saldoAnterior: new FormControl(abonosRawValue.saldoAnterior, {
        validators: [Validators.required],
      }),
      abono: new FormControl(abonosRawValue.abono, {
        validators: [Validators.required],
      }),
      nuevoSaldo: new FormControl(abonosRawValue.nuevoSaldo),
      facturas: new FormControl(abonosRawValue.facturas),
    });
  }

  getAbonos(form: AbonosFormGroup): IAbonos | NewAbonos {
    return form.getRawValue() as IAbonos | NewAbonos;
  }

  resetForm(form: AbonosFormGroup, abonos: AbonosFormGroupInput): void {
    const abonosRawValue = { ...this.getFormDefaults(), ...abonos };
    form.reset(
      {
        ...abonosRawValue,
        id: { value: abonosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AbonosFormDefaults {
    return {
      id: null,
    };
  }
}
