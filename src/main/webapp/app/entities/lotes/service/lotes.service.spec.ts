import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILotes } from '../lotes.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../lotes.test-samples';

import { LotesService, RestLotes } from './lotes.service';

const requireRestSample: RestLotes = {
  ...sampleWithRequiredData,
  fechaEntrada: sampleWithRequiredData.fechaEntrada?.format(DATE_FORMAT),
};

describe('Lotes Service', () => {
  let service: LotesService;
  let httpMock: HttpTestingController;
  let expectedResult: ILotes | ILotes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LotesService);
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

    it('should create a Lotes', () => {
      const lotes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Lotes', () => {
      const lotes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Lotes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Lotes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Lotes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLotesToCollectionIfMissing', () => {
      it('should add a Lotes to an empty array', () => {
        const lotes: ILotes = sampleWithRequiredData;
        expectedResult = service.addLotesToCollectionIfMissing([], lotes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lotes);
      });

      it('should not add a Lotes to an array that contains it', () => {
        const lotes: ILotes = sampleWithRequiredData;
        const lotesCollection: ILotes[] = [
          {
            ...lotes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLotesToCollectionIfMissing(lotesCollection, lotes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Lotes to an array that doesn't contain it", () => {
        const lotes: ILotes = sampleWithRequiredData;
        const lotesCollection: ILotes[] = [sampleWithPartialData];
        expectedResult = service.addLotesToCollectionIfMissing(lotesCollection, lotes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lotes);
      });

      it('should add only unique Lotes to an array', () => {
        const lotesArray: ILotes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lotesCollection: ILotes[] = [sampleWithRequiredData];
        expectedResult = service.addLotesToCollectionIfMissing(lotesCollection, ...lotesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lotes: ILotes = sampleWithRequiredData;
        const lotes2: ILotes = sampleWithPartialData;
        expectedResult = service.addLotesToCollectionIfMissing([], lotes, lotes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lotes);
        expect(expectedResult).toContain(lotes2);
      });

      it('should accept null and undefined values', () => {
        const lotes: ILotes = sampleWithRequiredData;
        expectedResult = service.addLotesToCollectionIfMissing([], null, lotes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lotes);
      });

      it('should return initial array if no Lotes is added', () => {
        const lotesCollection: ILotes[] = [sampleWithRequiredData];
        expectedResult = service.addLotesToCollectionIfMissing(lotesCollection, undefined, null);
        expect(expectedResult).toEqual(lotesCollection);
      });
    });

    describe('compareLotes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLotes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLotes(entity1, entity2);
        const compareResult2 = service.compareLotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLotes(entity1, entity2);
        const compareResult2 = service.compareLotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLotes(entity1, entity2);
        const compareResult2 = service.compareLotes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
