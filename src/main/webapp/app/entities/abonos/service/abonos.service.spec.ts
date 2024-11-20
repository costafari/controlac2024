import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAbonos } from '../abonos.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../abonos.test-samples';

import { AbonosService } from './abonos.service';

const requireRestSample: IAbonos = {
  ...sampleWithRequiredData,
};

describe('Abonos Service', () => {
  let service: AbonosService;
  let httpMock: HttpTestingController;
  let expectedResult: IAbonos | IAbonos[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AbonosService);
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

    it('should create a Abonos', () => {
      const abonos = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(abonos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abonos', () => {
      const abonos = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(abonos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Abonos', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abonos', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Abonos', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAbonosToCollectionIfMissing', () => {
      it('should add a Abonos to an empty array', () => {
        const abonos: IAbonos = sampleWithRequiredData;
        expectedResult = service.addAbonosToCollectionIfMissing([], abonos);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abonos);
      });

      it('should not add a Abonos to an array that contains it', () => {
        const abonos: IAbonos = sampleWithRequiredData;
        const abonosCollection: IAbonos[] = [
          {
            ...abonos,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAbonosToCollectionIfMissing(abonosCollection, abonos);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abonos to an array that doesn't contain it", () => {
        const abonos: IAbonos = sampleWithRequiredData;
        const abonosCollection: IAbonos[] = [sampleWithPartialData];
        expectedResult = service.addAbonosToCollectionIfMissing(abonosCollection, abonos);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abonos);
      });

      it('should add only unique Abonos to an array', () => {
        const abonosArray: IAbonos[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const abonosCollection: IAbonos[] = [sampleWithRequiredData];
        expectedResult = service.addAbonosToCollectionIfMissing(abonosCollection, ...abonosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abonos: IAbonos = sampleWithRequiredData;
        const abonos2: IAbonos = sampleWithPartialData;
        expectedResult = service.addAbonosToCollectionIfMissing([], abonos, abonos2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abonos);
        expect(expectedResult).toContain(abonos2);
      });

      it('should accept null and undefined values', () => {
        const abonos: IAbonos = sampleWithRequiredData;
        expectedResult = service.addAbonosToCollectionIfMissing([], null, abonos, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abonos);
      });

      it('should return initial array if no Abonos is added', () => {
        const abonosCollection: IAbonos[] = [sampleWithRequiredData];
        expectedResult = service.addAbonosToCollectionIfMissing(abonosCollection, undefined, null);
        expect(expectedResult).toEqual(abonosCollection);
      });
    });

    describe('compareAbonos', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAbonos(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAbonos(entity1, entity2);
        const compareResult2 = service.compareAbonos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAbonos(entity1, entity2);
        const compareResult2 = service.compareAbonos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAbonos(entity1, entity2);
        const compareResult2 = service.compareAbonos(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
