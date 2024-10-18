import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ClientesService } from '../service/clientes.service';
import { IClientes } from '../clientes.model';
import { ClientesFormService } from './clientes-form.service';

import { ClientesUpdateComponent } from './clientes-update.component';

describe('Clientes Management Update Component', () => {
  let comp: ClientesUpdateComponent;
  let fixture: ComponentFixture<ClientesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientesFormService: ClientesFormService;
  let clientesService: ClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientesUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ClientesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientesFormService = TestBed.inject(ClientesFormService);
    clientesService = TestBed.inject(ClientesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const clientes: IClientes = { id: 456 };

      activatedRoute.data = of({ clientes });
      comp.ngOnInit();

      expect(comp.clientes).toEqual(clientes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientes>>();
      const clientes = { id: 123 };
      jest.spyOn(clientesFormService, 'getClientes').mockReturnValue(clientes);
      jest.spyOn(clientesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientes }));
      saveSubject.complete();

      // THEN
      expect(clientesFormService.getClientes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientesService.update).toHaveBeenCalledWith(expect.objectContaining(clientes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientes>>();
      const clientes = { id: 123 };
      jest.spyOn(clientesFormService, 'getClientes').mockReturnValue({ id: null });
      jest.spyOn(clientesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientes }));
      saveSubject.complete();

      // THEN
      expect(clientesFormService.getClientes).toHaveBeenCalled();
      expect(clientesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientes>>();
      const clientes = { id: 123 };
      jest.spyOn(clientesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
