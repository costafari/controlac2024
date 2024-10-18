import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProveedores } from 'app/entities/proveedores/proveedores.model';
import { ProveedoresService } from 'app/entities/proveedores/service/proveedores.service';
import { LotesService } from '../service/lotes.service';
import { ILotes } from '../lotes.model';
import { LotesFormService } from './lotes-form.service';

import { LotesUpdateComponent } from './lotes-update.component';

describe('Lotes Management Update Component', () => {
  let comp: LotesUpdateComponent;
  let fixture: ComponentFixture<LotesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lotesFormService: LotesFormService;
  let lotesService: LotesService;
  let proveedoresService: ProveedoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LotesUpdateComponent],
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
      .overrideTemplate(LotesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LotesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lotesFormService = TestBed.inject(LotesFormService);
    lotesService = TestBed.inject(LotesService);
    proveedoresService = TestBed.inject(ProveedoresService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call proveedores query and add missing value', () => {
      const lotes: ILotes = { id: 456 };
      const proveedores: IProveedores = { id: 7232 };
      lotes.proveedores = proveedores;

      const proveedoresCollection: IProveedores[] = [{ id: 24531 }];
      jest.spyOn(proveedoresService, 'query').mockReturnValue(of(new HttpResponse({ body: proveedoresCollection })));
      const expectedCollection: IProveedores[] = [proveedores, ...proveedoresCollection];
      jest.spyOn(proveedoresService, 'addProveedoresToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lotes });
      comp.ngOnInit();

      expect(proveedoresService.query).toHaveBeenCalled();
      expect(proveedoresService.addProveedoresToCollectionIfMissing).toHaveBeenCalledWith(proveedoresCollection, proveedores);
      expect(comp.proveedoresCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lotes: ILotes = { id: 456 };
      const proveedores: IProveedores = { id: 14702 };
      lotes.proveedores = proveedores;

      activatedRoute.data = of({ lotes });
      comp.ngOnInit();

      expect(comp.proveedoresCollection).toContain(proveedores);
      expect(comp.lotes).toEqual(lotes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILotes>>();
      const lotes = { id: 123 };
      jest.spyOn(lotesFormService, 'getLotes').mockReturnValue(lotes);
      jest.spyOn(lotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lotes }));
      saveSubject.complete();

      // THEN
      expect(lotesFormService.getLotes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lotesService.update).toHaveBeenCalledWith(expect.objectContaining(lotes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILotes>>();
      const lotes = { id: 123 };
      jest.spyOn(lotesFormService, 'getLotes').mockReturnValue({ id: null });
      jest.spyOn(lotesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lotes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lotes }));
      saveSubject.complete();

      // THEN
      expect(lotesFormService.getLotes).toHaveBeenCalled();
      expect(lotesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILotes>>();
      const lotes = { id: 123 };
      jest.spyOn(lotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lotesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProveedores', () => {
      it('Should forward to proveedoresService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(proveedoresService, 'compareProveedores');
        comp.compareProveedores(entity, entity2);
        expect(proveedoresService.compareProveedores).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
