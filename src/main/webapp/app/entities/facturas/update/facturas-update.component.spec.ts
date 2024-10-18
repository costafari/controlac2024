import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IClientes } from 'app/entities/clientes/clientes.model';
import { ClientesService } from 'app/entities/clientes/service/clientes.service';
import { ILotes } from 'app/entities/lotes/lotes.model';
import { LotesService } from 'app/entities/lotes/service/lotes.service';
import { IDetalles } from 'app/entities/detalles/detalles.model';
import { DetallesService } from 'app/entities/detalles/service/detalles.service';
import { IFacturas } from '../facturas.model';
import { FacturasService } from '../service/facturas.service';
import { FacturasFormService } from './facturas-form.service';

import { FacturasUpdateComponent } from './facturas-update.component';

describe('Facturas Management Update Component', () => {
  let comp: FacturasUpdateComponent;
  let fixture: ComponentFixture<FacturasUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facturasFormService: FacturasFormService;
  let facturasService: FacturasService;
  let clientesService: ClientesService;
  let lotesService: LotesService;
  let detallesService: DetallesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FacturasUpdateComponent],
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
      .overrideTemplate(FacturasUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturasUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facturasFormService = TestBed.inject(FacturasFormService);
    facturasService = TestBed.inject(FacturasService);
    clientesService = TestBed.inject(ClientesService);
    lotesService = TestBed.inject(LotesService);
    detallesService = TestBed.inject(DetallesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call clientes query and add missing value', () => {
      const facturas: IFacturas = { id: 456 };
      const clientes: IClientes = { id: 18328 };
      facturas.clientes = clientes;

      const clientesCollection: IClientes[] = [{ id: 14455 }];
      jest.spyOn(clientesService, 'query').mockReturnValue(of(new HttpResponse({ body: clientesCollection })));
      const expectedCollection: IClientes[] = [clientes, ...clientesCollection];
      jest.spyOn(clientesService, 'addClientesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      expect(clientesService.query).toHaveBeenCalled();
      expect(clientesService.addClientesToCollectionIfMissing).toHaveBeenCalledWith(clientesCollection, clientes);
      expect(comp.clientesCollection).toEqual(expectedCollection);
    });

    it('Should call Lotes query and add missing value', () => {
      const facturas: IFacturas = { id: 456 };
      const lotes: ILotes = { id: 5997 };
      facturas.lotes = lotes;

      const lotesCollection: ILotes[] = [{ id: 10266 }];
      jest.spyOn(lotesService, 'query').mockReturnValue(of(new HttpResponse({ body: lotesCollection })));
      const additionalLotes = [lotes];
      const expectedCollection: ILotes[] = [...additionalLotes, ...lotesCollection];
      jest.spyOn(lotesService, 'addLotesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      expect(lotesService.query).toHaveBeenCalled();
      expect(lotesService.addLotesToCollectionIfMissing).toHaveBeenCalledWith(
        lotesCollection,
        ...additionalLotes.map(expect.objectContaining),
      );
      expect(comp.lotesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Detalles query and add missing value', () => {
      const facturas: IFacturas = { id: 456 };
      const detalles: IDetalles = { id: 19098 };
      facturas.detalles = detalles;

      const detallesCollection: IDetalles[] = [{ id: 17720 }];
      jest.spyOn(detallesService, 'query').mockReturnValue(of(new HttpResponse({ body: detallesCollection })));
      const additionalDetalles = [detalles];
      const expectedCollection: IDetalles[] = [...additionalDetalles, ...detallesCollection];
      jest.spyOn(detallesService, 'addDetallesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      expect(detallesService.query).toHaveBeenCalled();
      expect(detallesService.addDetallesToCollectionIfMissing).toHaveBeenCalledWith(
        detallesCollection,
        ...additionalDetalles.map(expect.objectContaining),
      );
      expect(comp.detallesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const facturas: IFacturas = { id: 456 };
      const clientes: IClientes = { id: 31874 };
      facturas.clientes = clientes;
      const lotes: ILotes = { id: 26183 };
      facturas.lotes = lotes;
      const detalles: IDetalles = { id: 3949 };
      facturas.detalles = detalles;

      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      expect(comp.clientesCollection).toContain(clientes);
      expect(comp.lotesSharedCollection).toContain(lotes);
      expect(comp.detallesSharedCollection).toContain(detalles);
      expect(comp.facturas).toEqual(facturas);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacturas>>();
      const facturas = { id: 123 };
      jest.spyOn(facturasFormService, 'getFacturas').mockReturnValue(facturas);
      jest.spyOn(facturasService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facturas }));
      saveSubject.complete();

      // THEN
      expect(facturasFormService.getFacturas).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(facturasService.update).toHaveBeenCalledWith(expect.objectContaining(facturas));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacturas>>();
      const facturas = { id: 123 };
      jest.spyOn(facturasFormService, 'getFacturas').mockReturnValue({ id: null });
      jest.spyOn(facturasService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturas: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facturas }));
      saveSubject.complete();

      // THEN
      expect(facturasFormService.getFacturas).toHaveBeenCalled();
      expect(facturasService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacturas>>();
      const facturas = { id: 123 };
      jest.spyOn(facturasService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturas });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facturasService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClientes', () => {
      it('Should forward to clientesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientesService, 'compareClientes');
        comp.compareClientes(entity, entity2);
        expect(clientesService.compareClientes).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLotes', () => {
      it('Should forward to lotesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(lotesService, 'compareLotes');
        comp.compareLotes(entity, entity2);
        expect(lotesService.compareLotes).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDetalles', () => {
      it('Should forward to detallesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(detallesService, 'compareDetalles');
        comp.compareDetalles(entity, entity2);
        expect(detallesService.compareDetalles).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
