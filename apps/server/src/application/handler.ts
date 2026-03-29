export type HandlerRequest<P = unknown, B = unknown, Q = unknown> = {
  params: P;
  body: B;
  query: Q;
};

export type HandlerResponse = {
  status: (code: number) => HandlerResponse;
  json: (data: unknown) => void;
};

export type Handler<P = unknown, B = unknown, Q = unknown> = (
  req: HandlerRequest<P, B, Q>,
  res: HandlerResponse
) => Promise<void>;
