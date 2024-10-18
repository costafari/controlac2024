import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../lotes.test-samples';

import { LotesFormService } from './lotes-form.service';

describe('Lotes Form Service', () => {
  let service: LotesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotesFormService);
  });

  describe('Service methods', () => {
    describe('createLotesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLotesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            fechaEntrada: expect.any(Object),
            lote: expect.any(Object),
            proveedores: expect.any(Object),
          }),
        );
      });

      it('passing ILotes should create a new form with FormGroup', () => {
        const formGroup = service.createLotesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidad: expect.any(Object),
            fechaEntrada: expect.any(Object),
            lote: expect.any(Object),
            proveedores: expect.any(Object),
          }),
        );
      });
    });

    describe('getLotes', () => {
      it('should return NewLotes for default Lotes initial value', () => {
        const formGroup = service.createLotesFormGroup(sampleWithNewData);

        const lotes = service.getLotes(formGroup) as any;

        expect(lotes).toMatchObject(sampleWithNewData);
      });

      it('should return NewLotes for empty Lotes initial value', () => {
        const formGroup = service.createLotesFormGroup();

        const lotes = service.getLotes(formGroup) as any;

        expect(lotes).toMatchObject({});
      });

      it('should return ILotes', () => {
        const formGroup = service.createLotesFormGroup(sampleWithRequiredData);

        const lotes = service.getLotes(formGroup) as any;

        expect(lotes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILotes should not enable id FormControl', () => {
        const formGroup = service.createLotesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLotes should disable id FormControl', () => {
        const formGroup = service.createLotesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
