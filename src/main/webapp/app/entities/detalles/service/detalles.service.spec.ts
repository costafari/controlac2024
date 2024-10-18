import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDetalles } from '../detalles.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../detalles.test-samples';

import { DetallesService } from './detalles.service';

const requireRestSample: IDetalles = {
  ...sampleWithRequiredData,
};

describe('Detalles Service', () => {
  let service: DetallesService;
  let httpMock: HttpTestingController;
  let expectedResult: IDetalles | IDetalles[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DetallesService);
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

    it('should create a Detalles', () => {
      const detalles = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(detalles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Detalles', () => {
      const detalles = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(detalles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Detalles', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Detalles', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Detalles', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDetallesToCollectionIfMissing', () => {
      it('should add a Detalles to an empty array', () => {
        const detalles: IDetalles = sampleWithRequiredData;
        expectedResult = service.addDetallesToCollectionIfMissing([], detalles);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detalles);
      });

      it('should not add a Detalles to an array that contains it', () => {
        const detalles: IDetalles = sampleWithRequiredData;
        const detallesCollection: IDetalles[] = [
          {
            ...detalles,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDetallesToCollectionIfMissing(detallesCollection, detalles);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Detalles to an array that doesn't contain it", () => {
        const detalles: IDetalles = sampleWithRequiredData;
        const detallesCollection: IDetalles[] = [sampleWithPartialData];
        expectedResult = service.addDetallesToCollectionIfMissing(detallesCollection, detalles);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detalles);
      });

      it('should add only unique Detalles to an array', () => {
        const detallesArray: IDetalles[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const detallesCollection: IDetalles[] = [sampleWithRequiredData];
        expectedResult = service.addDetallesToCollectionIfMissing(detallesCollection, ...detallesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const detalles: IDetalles = sampleWithRequiredData;
        const detalles2: IDetalles = sampleWithPartialData;
        expectedResult = service.addDetallesToCollectionIfMissing([], detalles, detalles2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detalles);
        expect(expectedResult).toContain(detalles2);
      });

      it('should accept null and undefined values', () => {
        const detalles: IDetalles = sampleWithRequiredData;
        expectedResult = service.addDetallesToCollectionIfMissing([], null, detalles, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detalles);
      });

      it('should return initial array if no Detalles is added', () => {
        const detallesCollection: IDetalles[] = [sampleWithRequiredData];
        expectedResult = service.addDetallesToCollectionIfMissing(detallesCollection, undefined, null);
        expect(expectedResult).toEqual(detallesCollection);
      });
    });

    describe('compareDetalles', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDetalles(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDetalles(entity1, entity2);
        const compareResult2 = service.compareDetalles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDetalles(entity1, entity2);
        const compareResult2 = service.compareDetalles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDetalles(entity1, entity2);
        const compareResult2 = service.compareDetalles(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
