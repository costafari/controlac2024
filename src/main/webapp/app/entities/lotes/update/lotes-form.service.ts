import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILotes, NewLotes } from '../lotes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILotes for edit and NewLotesFormGroupInput for create.
 */
type LotesFormGroupInput = ILotes | PartialWithRequiredKeyOf<NewLotes>;

type LotesFormDefaults = Pick<NewLotes, 'id'>;

type LotesFormGroupContent = {
  id: FormControl<ILotes['id'] | NewLotes['id']>;
  cantidad: FormControl<ILotes['cantidad']>;
  fechaEntrada: FormControl<ILotes['fechaEntrada']>;
  lote: FormControl<ILotes['lote']>;
  proveedores: FormControl<ILotes['proveedores']>;
};

export type LotesFormGroup = FormGroup<LotesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LotesFormService {
  createLotesFormGroup(lotes: LotesFormGroupInput = { id: null }): LotesFormGroup {
    const lotesRawValue = {
      ...this.getFormDefaults(),
      ...lotes,
    };
    return new FormGroup<LotesFormGroupContent>({
      id: new FormControl(
        { value: lotesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      cantidad: new FormControl(lotesRawValue.cantidad),
      fechaEntrada: new FormControl(lotesRawValue.fechaEntrada),
      lote: new FormControl(lotesRawValue.lote),
      proveedores: new FormControl(lotesRawValue.proveedores),
    });
  }

  getLotes(form: LotesFormGroup): ILotes | NewLotes {
    return form.getRawValue() as ILotes | NewLotes;
  }

  resetForm(form: LotesFormGroup, lotes: LotesFormGroupInput): void {
    const lotesRawValue = { ...this.getFormDefaults(), ...lotes };
    form.reset(
      {
        ...lotesRawValue,
        id: { value: lotesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LotesFormDefaults {
    return {
      id: null,
    };
  }
}
