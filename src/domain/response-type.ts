import type { DETAILED_ERROR } from './detailed-error.js';

export type UseCaseResponseType<TData> =
  | (TData extends void
      ? { state: 'success' }
      : { state: 'success'; data: TData })
  | {
      state: 'error';
      detailedError: DETAILED_ERROR;
    };

export type RepositoryResponseType<TData> =
  | (TData extends void
      ? { state: 'success' }
      : { state: 'success'; data: TData })
  | {
      state: 'error';
      detailedError: DETAILED_ERROR;
    };
