import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../clientes.test-samples';

import { ClientesFormService } from './clientes-form.service';

describe('Clientes Form Service', () => {
  let service: ClientesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesFormService);
  });

  describe('Service methods', () => {
    describe('createClientesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            activo: expect.any(Object),
            apellidos: expect.any(Object),
            direcion: expect.any(Object),
            email: expect.any(Object),
            nombreContacto: expect.any(Object),
            nombreEmpresa: expect.any(Object),
            nombres: expect.any(Object),
            notas: expect.any(Object),
            sitioWeb: expect.any(Object),
            telefonoFijo: expect.any(Object),
            telefonoFijo2: expect.any(Object),
            telefonoMovil: expect.any(Object),
            telefonoMovil2: expect.any(Object),
          }),
        );
      });

      it('passing IClientes should create a new form with FormGroup', () => {
        const formGroup = service.createClientesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            activo: expect.any(Object),
            apellidos: expect.any(Object),
            direcion: expect.any(Object),
            email: expect.any(Object),
            nombreContacto: expect.any(Object),
            nombreEmpresa: expect.any(Object),
            nombres: expect.any(Object),
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

    describe('getClientes', () => {
      it('should return NewClientes for default Clientes initial value', () => {
        const formGroup = service.createClientesFormGroup(sampleWithNewData);

        const clientes = service.getClientes(formGroup) as any;

        expect(clientes).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientes for empty Clientes initial value', () => {
        const formGroup = service.createClientesFormGroup();

        const clientes = service.getClientes(formGroup) as any;

        expect(clientes).toMatchObject({});
      });

      it('should return IClientes', () => {
        const formGroup = service.createClientesFormGroup(sampleWithRequiredData);

        const clientes = service.getClientes(formGroup) as any;

        expect(clientes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClientes should not enable id FormControl', () => {
        const formGroup = service.createClientesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientes should disable id FormControl', () => {
        const formGroup = service.createClientesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
