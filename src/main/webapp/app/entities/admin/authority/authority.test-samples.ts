import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'c2b139ca-7a9f-4d16-94ae-21aef802d3c0',
};

export const sampleWithPartialData: IAuthority = {
  name: '4be99d1b-c56b-4035-96f2-fb89b5c6880c',
};

export const sampleWithFullData: IAuthority = {
  name: '6f664d8f-eb76-464d-a8ee-7760a82ecad3',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
