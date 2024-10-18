import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFacturas, NewFacturas } from '../facturas.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFacturas for edit and NewFacturasFormGroupInput for create.
 */
type FacturasFormGroupInput = IFacturas | PartialWithRequiredKeyOf<NewFacturas>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFacturas | NewFacturas> = Omit<T, 'fechaFactura'> & {
  fechaFactura?: string | null;
};

type FacturasFormRawValue = FormValueOf<IFacturas>;

type NewFacturasFormRawValue = FormValueOf<NewFacturas>;

type FacturasFormDefaults = Pick<NewFacturas, 'id' | 'fechaFactura' | 'condicionPago'>;

type FacturasFormGroupContent = {
  id: FormControl<FacturasFormRawValue['id'] | NewFacturas['id']>;
  numeroFactura: FormControl<FacturasFormRawValue['numeroFactura']>;
  fechaFactura: FormControl<FacturasFormRawValue['fechaFactura']>;
  condicionPago: FormControl<FacturasFormRawValue['condicionPago']>;
  clientes: FormControl<FacturasFormRawValue['clientes']>;
  lotes: FormControl<FacturasFormRawValue['lotes']>;
  detalles: FormControl<FacturasFormRawValue['detalles']>;
};

export type FacturasFormGroup = FormGroup<FacturasFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FacturasFormService {
  createFacturasFormGroup(facturas: FacturasFormGroupInput = { id: null }): FacturasFormGroup {
    const facturasRawValue = this.convertFacturasToFacturasRawValue({
      ...this.getFormDefaults(),
      ...facturas,
    });
    return new FormGroup<FacturasFormGroupContent>({
      id: new FormControl(
        { value: facturasRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroFactura: new FormControl(facturasRawValue.numeroFactura, {
        validators: [Validators.required],
      }),
      fechaFactura: new FormControl(facturasRawValue.fechaFactura),
      condicionPago: new FormControl(facturasRawValue.condicionPago),
      clientes: new FormControl(facturasRawValue.clientes),
      lotes: new FormControl(facturasRawValue.lotes),
      detalles: new FormControl(facturasRawValue.detalles),
    });
  }

  getFacturas(form: FacturasFormGroup): IFacturas | NewFacturas {
    return this.convertFacturasRawValueToFacturas(form.getRawValue() as FacturasFormRawValue | NewFacturasFormRawValue);
  }

  resetForm(form: FacturasFormGroup, facturas: FacturasFormGroupInput): void {
    const facturasRawValue = this.convertFacturasToFacturasRawValue({ ...this.getFormDefaults(), ...facturas });
    form.reset(
      {
        ...facturasRawValue,
        id: { value: facturasRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FacturasFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaFactura: currentTime,
      condicionPago: false,
    };
  }

  private convertFacturasRawValueToFacturas(rawFacturas: FacturasFormRawValue | NewFacturasFormRawValue): IFacturas | NewFacturas {
    return {
      ...rawFacturas,
      fechaFactura: dayjs(rawFacturas.fechaFactura, DATE_TIME_FORMAT),
    };
  }

  private convertFacturasToFacturasRawValue(
    facturas: IFacturas | (Partial<NewFacturas> & FacturasFormDefaults),
  ): FacturasFormRawValue | PartialWithRequiredKeyOf<NewFacturasFormRawValue> {
    return {
      ...facturas,
      fechaFactura: facturas.fechaFactura ? facturas.fechaFactura.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
