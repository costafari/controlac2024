import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ProveedoresService } from '../service/proveedores.service';
import { IProveedores } from '../proveedores.model';
import { ProveedoresFormService } from './proveedores-form.service';

import { ProveedoresUpdateComponent } from './proveedores-update.component';

describe('Proveedores Management Update Component', () => {
  let comp: ProveedoresUpdateComponent;
  let fixture: ComponentFixture<ProveedoresUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let proveedoresFormService: ProveedoresFormService;
  let proveedoresService: ProveedoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProveedoresUpdateComponent],
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
      .overrideTemplate(ProveedoresUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProveedoresUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    proveedoresFormService = TestBed.inject(ProveedoresFormService);
    proveedoresService = TestBed.inject(ProveedoresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const proveedores: IProveedores = { id: 456 };

      activatedRoute.data = of({ proveedores });
      comp.ngOnInit();

      expect(comp.proveedores).toEqual(proveedores);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProveedores>>();
      const proveedores = { id: 123 };
      jest.spyOn(proveedoresFormService, 'getProveedores').mockReturnValue(proveedores);
      jest.spyOn(proveedoresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proveedores });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proveedores }));
      saveSubject.complete();

      // THEN
      expect(proveedoresFormService.getProveedores).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(proveedoresService.update).toHaveBeenCalledWith(expect.objectContaining(proveedores));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProveedores>>();
      const proveedores = { id: 123 };
      jest.spyOn(proveedoresFormService, 'getProveedores').mockReturnValue({ id: null });
      jest.spyOn(proveedoresService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proveedores: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proveedores }));
      saveSubject.complete();

      // THEN
      expect(proveedoresFormService.getProveedores).toHaveBeenCalled();
      expect(proveedoresService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProveedores>>();
      const proveedores = { id: 123 };
      jest.spyOn(proveedoresService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proveedores });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(proveedoresService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
