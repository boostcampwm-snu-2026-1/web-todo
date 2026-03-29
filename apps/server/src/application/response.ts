import type { ErrorCode } from '../domain/detailed-error.js';
import { statusFromCode } from '../domain/detailed-error.js';
import type {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from '../domain/response.js';
import type { HandlerResponse } from './handler.js';

export const success = <T>(data: T): SuccessResponse<T> => ({
  status: 'success',
  data,
});
export const error = (code: ErrorCode, message: string): ErrorResponse => ({
  status: 'error',
  code,
  message,
});
export const sendResponse = <T>(
  res: HandlerResponse,
  result: ApiResponse<T>,
  successStatus = 200
) => {
  if (result.status === 'error') {
    res.status(statusFromCode(result.code)).json(result);
    return;
  }
  res.status(successStatus).json(result.data);
};
