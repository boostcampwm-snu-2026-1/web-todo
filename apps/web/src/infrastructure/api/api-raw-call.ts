import type { RawCallParams } from '../../domain/api/api-domain';

const BASE_URL = '/api';
export const localServerCall = async (content: RawCallParams) => {
  const response = await fetch(`${BASE_URL}/${content.path}`, {
    method: content.method,
    headers: content.headers,
    ...(content.body !== undefined
      ? { body: JSON.stringify(content.body) }
      : {}),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown;

  return {
    status: response.status,
    data: responseBody,
  };
};
