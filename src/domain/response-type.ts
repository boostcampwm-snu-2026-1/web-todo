import type { DetailedError } from './detailed-error';

export type UseCaseResponseType<TData> =
  | (TData extends void
      ? { state: 'success' }
      : { state: 'success'; data: TData })
  | {
      state: 'error';
      detailedError: DetailedError;
    };

export type RepositoryResponseType<TData> =
  | (TData extends void
      ? { state: 'success' }
      : { state: 'success'; data: TData })
  | {
      state: 'error';
      detailedError: DetailedError;
    };
