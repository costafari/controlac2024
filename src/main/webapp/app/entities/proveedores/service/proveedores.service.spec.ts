import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IProveedores } from '../proveedores.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../proveedores.test-samples';

import { ProveedoresService } from './proveedores.service';

const requireRestSample: IProveedores = {
  ...sampleWithRequiredData,
};

describe('Proveedores Service', () => {
  let service: ProveedoresService;
  let httpMock: HttpTestingController;
  let expectedResult: IProveedores | IProveedores[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ProveedoresService);
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

    it('should create a Proveedores', () => {
      const proveedores = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(proveedores).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Proveedores', () => {
      const proveedores = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(proveedores).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Proveedores', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Proveedores', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Proveedores', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProveedoresToCollectionIfMissing', () => {
      it('should add a Proveedores to an empty array', () => {
        const proveedores: IProveedores = sampleWithRequiredData;
        expectedResult = service.addProveedoresToCollectionIfMissing([], proveedores);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proveedores);
      });

      it('should not add a Proveedores to an array that contains it', () => {
        const proveedores: IProveedores = sampleWithRequiredData;
        const proveedoresCollection: IProveedores[] = [
          {
            ...proveedores,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProveedoresToCollectionIfMissing(proveedoresCollection, proveedores);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Proveedores to an array that doesn't contain it", () => {
        const proveedores: IProveedores = sampleWithRequiredData;
        const proveedoresCollection: IProveedores[] = [sampleWithPartialData];
        expectedResult = service.addProveedoresToCollectionIfMissing(proveedoresCollection, proveedores);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proveedores);
      });

      it('should add only unique Proveedores to an array', () => {
        const proveedoresArray: IProveedores[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const proveedoresCollection: IProveedores[] = [sampleWithRequiredData];
        expectedResult = service.addProveedoresToCollectionIfMissing(proveedoresCollection, ...proveedoresArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const proveedores: IProveedores = sampleWithRequiredData;
        const proveedores2: IProveedores = sampleWithPartialData;
        expectedResult = service.addProveedoresToCollectionIfMissing([], proveedores, proveedores2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proveedores);
        expect(expectedResult).toContain(proveedores2);
      });

      it('should accept null and undefined values', () => {
        const proveedores: IProveedores = sampleWithRequiredData;
        expectedResult = service.addProveedoresToCollectionIfMissing([], null, proveedores, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proveedores);
      });

      it('should return initial array if no Proveedores is added', () => {
        const proveedoresCollection: IProveedores[] = [sampleWithRequiredData];
        expectedResult = service.addProveedoresToCollectionIfMissing(proveedoresCollection, undefined, null);
        expect(expectedResult).toEqual(proveedoresCollection);
      });
    });

    describe('compareProveedores', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProveedores(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProveedores(entity1, entity2);
        const compareResult2 = service.compareProveedores(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProveedores(entity1, entity2);
        const compareResult2 = service.compareProveedores(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProveedores(entity1, entity2);
        const compareResult2 = service.compareProveedores(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
