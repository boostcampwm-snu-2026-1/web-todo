import type { ErrorCode } from './detailed-error.js';

export type SuccessResponse<T> = {
  status: 'success';
  data: T;
};

export type ErrorResponse = {
  status: 'error';
  code: ErrorCode;
  message: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
