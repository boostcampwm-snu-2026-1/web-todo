export type RawCallParams = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: string;
};

export type CallParams = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
  token?: string;
};

export type ResponseNecessary = {
  status: number;
  data: unknown;
};

export type ErrorResponse<
  Status extends number = 400 | 401 | 403 | 404 | 409 | 500,
> = {
  status: Status;
  data: {
    timestamp: string;
    message: string;
    code: string;
  };
};

export type SuccessResponse<T, Status extends number = 200 | 201 | 304> = {
  status: Status;
  data: T;
};

export type RawCall = (_: RawCallParams) => Promise<ResponseNecessary>;

export type CallWithoutToken = <R extends ResponseNecessary>(
  params: CallParams & { token?: never }
) => Promise<R | ErrorResponse>;
