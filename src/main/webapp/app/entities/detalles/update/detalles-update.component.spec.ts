import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { DetallesService } from '../service/detalles.service';
import { IDetalles } from '../detalles.model';
import { DetallesFormService } from './detalles-form.service';

import { DetallesUpdateComponent } from './detalles-update.component';

describe('Detalles Management Update Component', () => {
  let comp: DetallesUpdateComponent;
  let fixture: ComponentFixture<DetallesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let detallesFormService: DetallesFormService;
  let detallesService: DetallesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetallesUpdateComponent],
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
      .overrideTemplate(DetallesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DetallesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    detallesFormService = TestBed.inject(DetallesFormService);
    detallesService = TestBed.inject(DetallesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const detalles: IDetalles = { id: 456 };

      activatedRoute.data = of({ detalles });
      comp.ngOnInit();

      expect(comp.detalles).toEqual(detalles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetalles>>();
      const detalles = { id: 123 };
      jest.spyOn(detallesFormService, 'getDetalles').mockReturnValue(detalles);
      jest.spyOn(detallesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detalles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detalles }));
      saveSubject.complete();

      // THEN
      expect(detallesFormService.getDetalles).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(detallesService.update).toHaveBeenCalledWith(expect.objectContaining(detalles));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetalles>>();
      const detalles = { id: 123 };
      jest.spyOn(detallesFormService, 'getDetalles').mockReturnValue({ id: null });
      jest.spyOn(detallesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detalles: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detalles }));
      saveSubject.complete();

      // THEN
      expect(detallesFormService.getDetalles).toHaveBeenCalled();
      expect(detallesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetalles>>();
      const detalles = { id: 123 };
      jest.spyOn(detallesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detalles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(detallesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
