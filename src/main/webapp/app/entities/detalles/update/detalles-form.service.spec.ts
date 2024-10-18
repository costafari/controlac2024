import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../detalles.test-samples';

import { DetallesFormService } from './detalles-form.service';

describe('Detalles Form Service', () => {
  let service: DetallesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesFormService);
  });

  describe('Service methods', () => {
    describe('createDetallesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDetallesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            total: expect.any(Object),
          }),
        );
      });

      it('passing IDetalles should create a new form with FormGroup', () => {
        const formGroup = service.createDetallesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            total: expect.any(Object),
          }),
        );
      });
    });

    describe('getDetalles', () => {
      it('should return NewDetalles for default Detalles initial value', () => {
        const formGroup = service.createDetallesFormGroup(sampleWithNewData);

        const detalles = service.getDetalles(formGroup) as any;

        expect(detalles).toMatchObject(sampleWithNewData);
      });

      it('should return NewDetalles for empty Detalles initial value', () => {
        const formGroup = service.createDetallesFormGroup();

        const detalles = service.getDetalles(formGroup) as any;

        expect(detalles).toMatchObject({});
      });

      it('should return IDetalles', () => {
        const formGroup = service.createDetallesFormGroup(sampleWithRequiredData);

        const detalles = service.getDetalles(formGroup) as any;

        expect(detalles).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDetalles should not enable id FormControl', () => {
        const formGroup = service.createDetallesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDetalles should disable id FormControl', () => {
        const formGroup = service.createDetallesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
