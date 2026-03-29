export const ERROR_CODE = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_ID: 'INVALID_ID',
  INVALID_INPUT: 'INVALID_INPUT',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

const STATUS_MAP = {
  [ERROR_CODE.NOT_FOUND]: 404,
  [ERROR_CODE.INVALID_ID]: 400,
  [ERROR_CODE.INVALID_INPUT]: 400,
  [ERROR_CODE.SERVER_ERROR]: 500,
};

export const statusFromCode = (code: ErrorCode) => STATUS_MAP[code] ?? 500;
