import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../proveedores.test-samples';

import { ProveedoresFormService } from './proveedores-form.service';

describe('Proveedores Form Service', () => {
  let service: ProveedoresFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresFormService);
  });

  describe('Service methods', () => {
    describe('createProveedoresFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProveedoresFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            direccion: expect.any(Object),
            nombreContacto: expect.any(Object),
            nombreEmpresa: expect.any(Object),
            notas: expect.any(Object),
            sitioWeb: expect.any(Object),
            telefonoFijo: expect.any(Object),
            telefonoFijo2: expect.any(Object),
            telefonoMovil: expect.any(Object),
            telefonoMovil2: expect.any(Object),
          }),
        );
      });

      it('passing IProveedores should create a new form with FormGroup', () => {
        const formGroup = service.createProveedoresFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            direccion: expect.any(Object),
            nombreContacto: expect.any(Object),
            nombreEmpresa: expect.any(Object),
            notas: expect.any(Object),
            sitioWeb: expect.any(Object),
            telefonoFijo: expect.any(Object),
            telefonoFijo2: expect.any(Object),
            telefonoMovil: expect.any(Object),
            telefonoMovil2: expect.any(Object),
          }),
        );
      });
    });

    describe('getProveedores', () => {
      it('should return NewProveedores for default Proveedores initial value', () => {
        const formGroup = service.createProveedoresFormGroup(sampleWithNewData);

        const proveedores = service.getProveedores(formGroup) as any;

        expect(proveedores).toMatchObject(sampleWithNewData);
      });

      it('should return NewProveedores for empty Proveedores initial value', () => {
        const formGroup = service.createProveedoresFormGroup();

        const proveedores = service.getProveedores(formGroup) as any;

        expect(proveedores).toMatchObject({});
      });

      it('should return IProveedores', () => {
        const formGroup = service.createProveedoresFormGroup(sampleWithRequiredData);

        const proveedores = service.getProveedores(formGroup) as any;

        expect(proveedores).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProveedores should not enable id FormControl', () => {
        const formGroup = service.createProveedoresFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProveedores should disable id FormControl', () => {
        const formGroup = service.createProveedoresFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
