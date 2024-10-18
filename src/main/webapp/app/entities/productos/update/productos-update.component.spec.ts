import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ILotes } from 'app/entities/lotes/lotes.model';
import { LotesService } from 'app/entities/lotes/service/lotes.service';
import { ProductosService } from '../service/productos.service';
import { IProductos } from '../productos.model';
import { ProductosFormService } from './productos-form.service';

import { ProductosUpdateComponent } from './productos-update.component';

describe('Productos Management Update Component', () => {
  let comp: ProductosUpdateComponent;
  let fixture: ComponentFixture<ProductosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productosFormService: ProductosFormService;
  let productosService: ProductosService;
  let lotesService: LotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductosUpdateComponent],
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
      .overrideTemplate(ProductosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productosFormService = TestBed.inject(ProductosFormService);
    productosService = TestBed.inject(ProductosService);
    lotesService = TestBed.inject(LotesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lotes query and add missing value', () => {
      const productos: IProductos = { id: 456 };
      const lotes: ILotes = { id: 9250 };
      productos.lotes = lotes;

      const lotesCollection: ILotes[] = [{ id: 274 }];
      jest.spyOn(lotesService, 'query').mockReturnValue(of(new HttpResponse({ body: lotesCollection })));
      const additionalLotes = [lotes];
      const expectedCollection: ILotes[] = [...additionalLotes, ...lotesCollection];
      jest.spyOn(lotesService, 'addLotesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productos });
      comp.ngOnInit();

      expect(lotesService.query).toHaveBeenCalled();
      expect(lotesService.addLotesToCollectionIfMissing).toHaveBeenCalledWith(
        lotesCollection,
        ...additionalLotes.map(expect.objectContaining),
      );
      expect(comp.lotesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productos: IProductos = { id: 456 };
      const lotes: ILotes = { id: 29963 };
      productos.lotes = lotes;

      activatedRoute.data = of({ productos });
      comp.ngOnInit();

      expect(comp.lotesSharedCollection).toContain(lotes);
      expect(comp.productos).toEqual(productos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductos>>();
      const productos = { id: 123 };
      jest.spyOn(productosFormService, 'getProductos').mockReturnValue(productos);
      jest.spyOn(productosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productos }));
      saveSubject.complete();

      // THEN
      expect(productosFormService.getProductos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productosService.update).toHaveBeenCalledWith(expect.objectContaining(productos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductos>>();
      const productos = { id: 123 };
      jest.spyOn(productosFormService, 'getProductos').mockReturnValue({ id: null });
      jest.spyOn(productosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productos }));
      saveSubject.complete();

      // THEN
      expect(productosFormService.getProductos).toHaveBeenCalled();
      expect(productosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductos>>();
      const productos = { id: 123 };
      jest.spyOn(productosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLotes', () => {
      it('Should forward to lotesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(lotesService, 'compareLotes');
        comp.compareLotes(entity, entity2);
        expect(lotesService.compareLotes).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
