import type {
  CallParams,
  CallWithoutToken,
  ErrorResponse,
  RawCall,
  ResponseNecessary,
} from '../../domain/api/api-domain';
import { decodeHtmlStrings } from './api-utils';

export const implApi = ({ rawCall }: { rawCall: RawCall }) => {
  const call = async <R extends ResponseNecessary>(content: {
    method: string;
    path: string;
    body?: Record<string, unknown>;
    token?: string;
  }) => {
    const response = await rawCall({
      method: content.method,
      path: content.path,
      body: content.body,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...(content.token !== undefined
          ? { Authorization: `Bearer ${content.token}` }
          : {}),
      },
      credentials: 'include',
    });

    return decodeHtmlStrings(response) as R;
  };

  const callWithoutToken: CallWithoutToken = <R extends ResponseNecessary>(
    params: CallParams & { token?: never }
  ) => call<R | ErrorResponse>(params);

  return { callWithoutToken };
};
