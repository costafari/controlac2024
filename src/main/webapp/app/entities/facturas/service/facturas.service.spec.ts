import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IFacturas } from '../facturas.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../facturas.test-samples';

import { FacturasService, RestFacturas } from './facturas.service';

const requireRestSample: RestFacturas = {
  ...sampleWithRequiredData,
  fechaFactura: sampleWithRequiredData.fechaFactura?.toJSON(),
};

describe('Facturas Service', () => {
  let service: FacturasService;
  let httpMock: HttpTestingController;
  let expectedResult: IFacturas | IFacturas[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(FacturasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Facturas', () => {
      const facturas = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(facturas).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Facturas', () => {
      const facturas = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(facturas).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Facturas', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Facturas', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Facturas', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFacturasToCollectionIfMissing', () => {
      it('should add a Facturas to an empty array', () => {
        const facturas: IFacturas = sampleWithRequiredData;
        expectedResult = service.addFacturasToCollectionIfMissing([], facturas);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facturas);
      });

      it('should not add a Facturas to an array that contains it', () => {
        const facturas: IFacturas = sampleWithRequiredData;
        const facturasCollection: IFacturas[] = [
          {
            ...facturas,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFacturasToCollectionIfMissing(facturasCollection, facturas);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Facturas to an array that doesn't contain it", () => {
        const facturas: IFacturas = sampleWithRequiredData;
        const facturasCollection: IFacturas[] = [sampleWithPartialData];
        expectedResult = service.addFacturasToCollectionIfMissing(facturasCollection, facturas);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facturas);
      });

      it('should add only unique Facturas to an array', () => {
        const facturasArray: IFacturas[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const facturasCollection: IFacturas[] = [sampleWithRequiredData];
        expectedResult = service.addFacturasToCollectionIfMissing(facturasCollection, ...facturasArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const facturas: IFacturas = sampleWithRequiredData;
        const facturas2: IFacturas = sampleWithPartialData;
        expectedResult = service.addFacturasToCollectionIfMissing([], facturas, facturas2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facturas);
        expect(expectedResult).toContain(facturas2);
      });

      it('should accept null and undefined values', () => {
        const facturas: IFacturas = sampleWithRequiredData;
        expectedResult = service.addFacturasToCollectionIfMissing([], null, facturas, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facturas);
      });

      it('should return initial array if no Facturas is added', () => {
        const facturasCollection: IFacturas[] = [sampleWithRequiredData];
        expectedResult = service.addFacturasToCollectionIfMissing(facturasCollection, undefined, null);
        expect(expectedResult).toEqual(facturasCollection);
      });
    });

    describe('compareFacturas', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFacturas(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFacturas(entity1, entity2);
        const compareResult2 = service.compareFacturas(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFacturas(entity1, entity2);
        const compareResult2 = service.compareFacturas(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFacturas(entity1, entity2);
        const compareResult2 = service.compareFacturas(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
