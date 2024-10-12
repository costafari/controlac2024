import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 28007,
  login: 'E_u',
};

export const sampleWithPartialData: IUser = {
  id: 5536,
  login: 'TiGC',
};

export const sampleWithFullData: IUser = {
  id: 7980,
  login: '!&?L{9@lmJG1s\\~4\\KpVAI5A\\;8\\"7Qa6\\7e5YNmk',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
