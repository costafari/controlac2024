import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProductos, NewProductos } from '../productos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductos for edit and NewProductosFormGroupInput for create.
 */
type ProductosFormGroupInput = IProductos | PartialWithRequiredKeyOf<NewProductos>;

type ProductosFormDefaults = Pick<NewProductos, 'id'>;

type ProductosFormGroupContent = {
  id: FormControl<IProductos['id'] | NewProductos['id']>;
  descipcion: FormControl<IProductos['descipcion']>;
  nombre: FormControl<IProductos['nombre']>;
  notas: FormControl<IProductos['notas']>;
  lotes: FormControl<IProductos['lotes']>;
};

export type ProductosFormGroup = FormGroup<ProductosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductosFormService {
  createProductosFormGroup(productos: ProductosFormGroupInput = { id: null }): ProductosFormGroup {
    const productosRawValue = {
      ...this.getFormDefaults(),
      ...productos,
    };
    return new FormGroup<ProductosFormGroupContent>({
      id: new FormControl(
        { value: productosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descipcion: new FormControl(productosRawValue.descipcion),
      nombre: new FormControl(productosRawValue.nombre),
      notas: new FormControl(productosRawValue.notas),
      lotes: new FormControl(productosRawValue.lotes),
    });
  }

  getProductos(form: ProductosFormGroup): IProductos | NewProductos {
    return form.getRawValue() as IProductos | NewProductos;
  }

  resetForm(form: ProductosFormGroup, productos: ProductosFormGroupInput): void {
    const productosRawValue = { ...this.getFormDefaults(), ...productos };
    form.reset(
      {
        ...productosRawValue,
        id: { value: productosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductosFormDefaults {
    return {
      id: null,
    };
  }
}
