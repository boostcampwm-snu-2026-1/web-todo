const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const decodeHtmlStrings = (
  input: Record<string, unknown> | undefined,
  recursive: boolean = true
) => {
  const decodeHtml = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent ?? html;
  };

  if (input === undefined) {
    return input;
  }

  if (isRecord(input)) {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') {
        result[key] = decodeHtml(value);
      } else if (recursive && isRecord(value)) {
        result[key] = decodeHtmlStrings(value, true);
      } else if (recursive && Array.isArray(value)) {
        result[key] = value.map((item: unknown) =>
          isRecord(item) ? decodeHtmlStrings(item, true) : item
        );
      } else {
        result[key] = value;
      }
    }

    return result;
  }
};

export const encodeQueryParams = ({
  params,
}: {
  params: Record<
    string,
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | null
    | undefined
  >;
}) => {
  const queryParameters = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return; // null, undefined 제외

    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParameters.append(key, v.toString());
      });
    } else {
      queryParameters.append(key, value.toString());
    }
  });

  return queryParameters.toString();
};
