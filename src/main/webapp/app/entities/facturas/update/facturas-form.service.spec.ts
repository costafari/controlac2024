import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../facturas.test-samples';

import { FacturasFormService } from './facturas-form.service';

describe('Facturas Form Service', () => {
  let service: FacturasFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturasFormService);
  });

  describe('Service methods', () => {
    describe('createFacturasFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFacturasFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroFactura: expect.any(Object),
            fechaFactura: expect.any(Object),
            condicionPago: expect.any(Object),
            clientes: expect.any(Object),
            lotes: expect.any(Object),
            detalles: expect.any(Object),
          }),
        );
      });

      it('passing IFacturas should create a new form with FormGroup', () => {
        const formGroup = service.createFacturasFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroFactura: expect.any(Object),
            fechaFactura: expect.any(Object),
            condicionPago: expect.any(Object),
            clientes: expect.any(Object),
            lotes: expect.any(Object),
            detalles: expect.any(Object),
          }),
        );
      });
    });

    describe('getFacturas', () => {
      it('should return NewFacturas for default Facturas initial value', () => {
        const formGroup = service.createFacturasFormGroup(sampleWithNewData);

        const facturas = service.getFacturas(formGroup) as any;

        expect(facturas).toMatchObject(sampleWithNewData);
      });

      it('should return NewFacturas for empty Facturas initial value', () => {
        const formGroup = service.createFacturasFormGroup();

        const facturas = service.getFacturas(formGroup) as any;

        expect(facturas).toMatchObject({});
      });

      it('should return IFacturas', () => {
        const formGroup = service.createFacturasFormGroup(sampleWithRequiredData);

        const facturas = service.getFacturas(formGroup) as any;

        expect(facturas).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFacturas should not enable id FormControl', () => {
        const formGroup = service.createFacturasFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFacturas should disable id FormControl', () => {
        const formGroup = service.createFacturasFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
