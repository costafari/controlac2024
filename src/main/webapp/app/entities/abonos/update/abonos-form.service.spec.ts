import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../abonos.test-samples';

import { AbonosFormService } from './abonos-form.service';

describe('Abonos Form Service', () => {
  let service: AbonosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbonosFormService);
  });

  describe('Service methods', () => {
    describe('createAbonosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAbonosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            saldoAnterior: expect.any(Object),
            abono: expect.any(Object),
            nuevoSaldo: expect.any(Object),
            facturas: expect.any(Object),
          }),
        );
      });

      it('passing IAbonos should create a new form with FormGroup', () => {
        const formGroup = service.createAbonosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            saldoAnterior: expect.any(Object),
            abono: expect.any(Object),
            nuevoSaldo: expect.any(Object),
            facturas: expect.any(Object),
          }),
        );
      });
    });

    describe('getAbonos', () => {
      it('should return NewAbonos for default Abonos initial value', () => {
        const formGroup = service.createAbonosFormGroup(sampleWithNewData);

        const abonos = service.getAbonos(formGroup) as any;

        expect(abonos).toMatchObject(sampleWithNewData);
      });

      it('should return NewAbonos for empty Abonos initial value', () => {
        const formGroup = service.createAbonosFormGroup();

        const abonos = service.getAbonos(formGroup) as any;

        expect(abonos).toMatchObject({});
      });

      it('should return IAbonos', () => {
        const formGroup = service.createAbonosFormGroup(sampleWithRequiredData);

        const abonos = service.getAbonos(formGroup) as any;

        expect(abonos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAbonos should not enable id FormControl', () => {
        const formGroup = service.createAbonosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAbonos should disable id FormControl', () => {
        const formGroup = service.createAbonosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
