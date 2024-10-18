import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IClientes } from '../clientes.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../clientes.test-samples';

import { ClientesService } from './clientes.service';

const requireRestSample: IClientes = {
  ...sampleWithRequiredData,
};

describe('Clientes Service', () => {
  let service: ClientesService;
  let httpMock: HttpTestingController;
  let expectedResult: IClientes | IClientes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClientesService);
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

    it('should create a Clientes', () => {
      const clientes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clientes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Clientes', () => {
      const clientes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clientes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Clientes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Clientes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Clientes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClientesToCollectionIfMissing', () => {
      it('should add a Clientes to an empty array', () => {
        const clientes: IClientes = sampleWithRequiredData;
        expectedResult = service.addClientesToCollectionIfMissing([], clientes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientes);
      });

      it('should not add a Clientes to an array that contains it', () => {
        const clientes: IClientes = sampleWithRequiredData;
        const clientesCollection: IClientes[] = [
          {
            ...clientes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientesToCollectionIfMissing(clientesCollection, clientes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Clientes to an array that doesn't contain it", () => {
        const clientes: IClientes = sampleWithRequiredData;
        const clientesCollection: IClientes[] = [sampleWithPartialData];
        expectedResult = service.addClientesToCollectionIfMissing(clientesCollection, clientes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientes);
      });

      it('should add only unique Clientes to an array', () => {
        const clientesArray: IClientes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientesCollection: IClientes[] = [sampleWithRequiredData];
        expectedResult = service.addClientesToCollectionIfMissing(clientesCollection, ...clientesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientes: IClientes = sampleWithRequiredData;
        const clientes2: IClientes = sampleWithPartialData;
        expectedResult = service.addClientesToCollectionIfMissing([], clientes, clientes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientes);
        expect(expectedResult).toContain(clientes2);
      });

      it('should accept null and undefined values', () => {
        const clientes: IClientes = sampleWithRequiredData;
        expectedResult = service.addClientesToCollectionIfMissing([], null, clientes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientes);
      });

      it('should return initial array if no Clientes is added', () => {
        const clientesCollection: IClientes[] = [sampleWithRequiredData];
        expectedResult = service.addClientesToCollectionIfMissing(clientesCollection, undefined, null);
        expect(expectedResult).toEqual(clientesCollection);
      });
    });

    describe('compareClientes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClientes(entity1, entity2);
        const compareResult2 = service.compareClientes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClientes(entity1, entity2);
        const compareResult2 = service.compareClientes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClientes(entity1, entity2);
        const compareResult2 = service.compareClientes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
