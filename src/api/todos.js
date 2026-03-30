const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/todos';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('서버 응답을 해석할 수 없습니다.');
  }
}

function assertOk(response, fallbackMessage) {
  if (response.ok) return;
  throw new Error(fallbackMessage || `요청이 실패했습니다. (${response.status})`);
}

export async function fetchTodoList() {
  const res = await fetch(BASE_URL);
  assertOk(res, '할 일 목록을 불러오지 못했습니다.');
  const data = await parseJsonResponse(res);
  if (!Array.isArray(data)) {
    throw new Error('목록 형식이 올바르지 않습니다.');
  }
  return data;
}

export async function createTodoOnServer(body) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      content: body.content,
      completed: body.completed ?? false,
    }),
  });
  assertOk(res, '할 일을 추가하지 못했습니다.');
  return parseJsonResponse(res);
}

export async function replaceTodoOnServer(id, body) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      content: body.content,
      completed: body.completed,
    }),
  });
  assertOk(res, '할 일을 수정하지 못했습니다.');
  return parseJsonResponse(res);
}

export async function deleteTodoOnServer(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  assertOk(res, '할 일을 삭제하지 못했습니다.');
  const data = await parseJsonResponse(res);
  return data;
}
