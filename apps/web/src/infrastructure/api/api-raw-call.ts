import type { RawCallParams } from '../../domain/api/api-domain';

const BASE_URL = 'https://69bf9c3872ca04f3bcb8c432.mockapi.io/api/v1';
export const localServerCall = async (content: RawCallParams) => {
  const response = await fetch(`${BASE_URL}/${content.path}`, {
    method: content.method,
    headers: content.headers,
    ...(content.body !== undefined
      ? { body: JSON.stringify(content.body) }
      : {}),
  });

  const echoRegex = /^echo\/.*$/;

  if (echoRegex.test(content.path)) {
    const responseText = (await response.text().catch(() => null)) as string;
    const responseBody = {
      message: responseText,
    };

    return {
      status: response.status,
      data: responseBody,
    };
  }

  const responseBody = (await response.json().catch(() => null)) as unknown;

  return {
    status: response.status,
    data: responseBody,
  };
};
