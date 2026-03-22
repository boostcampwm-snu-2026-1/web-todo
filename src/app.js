
import { announce, renderFilter, renderStatus, renderSummary, renderTodos } from './dom.js';
import { createTodoStore } from './state.js';
import { isDuplicateTodo, normalizeTodoText } from './utils.js';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const toolbar = document.querySelector('#toolbar');
const announcer = document.querySelector('#announcer');
const activeCount = document.querySelector('#active-count');
const clearCompletedButton = document.querySelector('#clear-completed');
const API_URL = 'https://67c08f0bb9d02a9f224a6903.mockapi.io/api/v1/todos';

if (!form || !input || !list || !count || !toolbar || !clearCompletedButton || !announcer || !activeCount) {
  throw new Error('필수 DOM 요소를 찾을 수 없습니다.');
}

const store = createTodoStore();
let isSubmitting = false;

function setSubmitting(nextState) {
  isSubmitting = nextState;
  input.disabled = nextState;
}

function mapServerTodo(serverTodo = {}) {
  return {
    id: String(serverTodo.id),
    text: String(serverTodo.todo ?? serverTodo.text ?? ''),
    completed: Boolean(serverTodo.completed),
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function fetchTodos() {
  const data = await request(API_URL);
  return Array.isArray(data) ? data.map(mapServerTodo).filter((todo) => todo.text) : [];
}

async function createTodoRequest(todoText) {
  const data = await request(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      todo: todoText,
      completed: false,
    }),
  });
  return mapServerTodo(data);
}

async function updateTodoRequest(todoId, partialTodo) {
  const data = await request(`${API_URL}/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(partialTodo),
  });
  return mapServerTodo(data);
}

async function deleteTodoRequest(todoId) {
  await request(`${API_URL}/${todoId}`, { method: 'DELETE' });
}

const filter = {
  value: 'all',
};

function getVisibleTodos(todos) {
  if (filter.value === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (filter.value === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function updateView() {
  const todos = store.getTodos();
  const stats = store.getStats();
  renderTodos(list, getVisibleTodos(todos));
  renderStatus(count, todos);
  renderFilter(toolbar, filter.value);
  renderSummary(activeCount, clearCompletedButton, stats);
}

async function handleAddTodo(event) {
  event.preventDefault();
  if (isSubmitting) {
    return;
  }

  const formData = new FormData(form);
  const value = normalizeTodoText(formData.get('todo'));

  if (!value) {
    input.setCustomValidity('할 일을 입력해주세요.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');

  if (isDuplicateTodo(store.getTodos(), value)) {
    input.setCustomValidity('동일한 TODO가 이미 존재합니다.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');
  try {
    setSubmitting(true);
    const created = await createTodoRequest(value);
    store.addTodoObject(created);
    announce(announcer, `할 일 추가: ${value}`);
    form.reset();
    input.focus();
  } catch {
    announce(announcer, '할 일 추가 중 오류가 발생했습니다.');
  } finally {
    setSubmitting(false);
  }
}

function mapServerTodo(serverTodo = {}) {
  return {
    id: String(serverTodo.id),
    text: String(serverTodo.todo ?? serverTodo.text ?? ''),
    completed: Boolean(serverTodo.completed),
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function fetchTodos() {
  const data = await request(API_URL);
  return Array.isArray(data) ? data.map(mapServerTodo).filter((todo) => todo.text) : [];
}

async function createTodoRequest(todoText) {
  const data = await request(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      todo: todoText,
      completed: false,
    }),
  });
  return mapServerTodo(data);
}

async function updateTodoRequest(todoId, partialTodo) {
  const data = await request(`${API_URL}/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(partialTodo),
  });
  return mapServerTodo(data);
}

async function deleteTodoRequest(todoId) {
  await request(`${API_URL}/${todoId}`, { method: 'DELETE' });
}

async function handleAddTodo(event) {
  event.preventDefault();
  if (isSubmitting) {
    return;
  }
  const formData = new FormData(form);
  const value = normalizeTodoText(formData.get('todo'));

  if (!value) {
    input.setCustomValidity('할 일을 입력해주세요.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');

  if (isDuplicateTodo(store.getTodos(), value)) {
    input.setCustomValidity('동일한 TODO가 이미 존재합니다.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');
  store.addTodo(value);
  announce(announcer, `할 일 추가: ${value}`);
  form.reset();
  input.focus();
  try {
    setSubmitting(true);
    const created = await createTodoRequest(value);
    store.addTodoObject(created);
    announce(announcer, `할 일 추가: ${value}`);
    form.reset();
    input.focus();
  } catch {
    announce(announcer, '할 일 추가 중 오류가 발생했습니다.');
  } finally {
    setSubmitting(false);
  }
}

function handleFilterClick(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const nextFilter = target.dataset.filter;
  if (!nextFilter) {
    return;
  }

  filter.value = nextFilter;
  announce(announcer, `필터 변경: ${target.textContent ?? '전체'}`);
  updateView();
}


function moveFilterFocus(currentButton, direction) {
  const chips = [...toolbar.querySelectorAll('.chip[data-filter]')];
  const index = chips.indexOf(currentButton);
  if (index < 0) {
    return;
@@ -105,91 +178,143 @@ function handleToolbarKeydown(event) {
  if (!(target instanceof HTMLButtonElement) || !target.dataset.filter) {
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveFilterFocus(target, 1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveFilterFocus(target, -1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    toolbar.querySelector('.chip[data-filter="all"]')?.focus();
  }

  if (event.key === 'End') {
    event.preventDefault();
    toolbar.querySelector('.chip[data-filter="completed"]')?.focus();
  }
}

function handleTodoAction(event) {
async function handleTodoAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const quickText = target.closest('[data-quick-add]')?.dataset.quickAdd;
  if (quickText) {
    const added = store.addTodo(quickText);
    if (added) {
      announce(announcer, `추천 할 일 추가: ${quickText}`);
    if (isDuplicateTodo(store.getTodos(), quickText)) {
      announce(announcer, '동일한 TODO가 이미 존재합니다.');
      return;
    }
    try {
      const created = await createTodoRequest(quickText);
      const added = store.addTodoObject(created);
      if (added) {
        announce(announcer, `추천 할 일 추가: ${quickText}`);
      }
    } catch {
      announce(announcer, '추천 할 일 추가 중 오류가 발생했습니다.');
    }
    return;
  }

  const row = target.closest('.todo-item');
  if (!row || !row.dataset.id) {
    return;
  }

  const actionEl = target.closest('[data-action]');
  const action = actionEl?.dataset.action;

  if (action === 'delete') {
    const text = row.querySelector('.todo-item__text')?.textContent ?? '할 일';
    store.removeTodo(row.dataset.id);
    announce(announcer, `할 일 삭제: ${text}`);
    try {
      await deleteTodoRequest(row.dataset.id);
      store.removeTodo(row.dataset.id);
      announce(announcer, `할 일 삭제: ${text}`);
    } catch {
      announce(announcer, '할 일 삭제 중 오류가 발생했습니다.');
    }
  }
}

function handleTodoToggle(event) {
async function handleTodoToggle(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.dataset.action !== 'toggle') {
    return;
  }

  const row = target.closest('.todo-item');
  if (!row || !row.dataset.id) {
    return;
  }

  const text = row.querySelector('.todo-item__text')?.textContent ?? '할 일';
  store.toggleTodo(row.dataset.id);
  announce(announcer, `완료 상태 변경: ${text}`);
  const currentTodo = store.getTodos().find((todo) => todo.id === row.dataset.id);
  if (!currentTodo) {
    return;
  }

  try {
    const updated = await updateTodoRequest(row.dataset.id, {
      completed: !currentTodo.completed,
      todo: currentTodo.text,
    });
    store.replaceTodo(row.dataset.id, updated);
    announce(announcer, `완료 상태 변경: ${text}`);
  } catch (error) {
    announce(announcer, '완료 상태 변경 중 오류가 발생했습니다.');
    target.checked = currentTodo.completed;
    console.error(error);
  }
}

function handleClearCompleted() {
  const removed = store.clearCompleted();
  if (removed) {
    announce(announcer, '완료된 할 일을 모두 삭제했습니다.');
async function handleClearCompleted() {
  const completedTodos = store.getTodos().filter((todo) => todo.completed);
  if (completedTodos.length === 0) {
    return;
  }

  try {
    await Promise.all(completedTodos.map((todo) => deleteTodoRequest(todo.id)));
    const removed = store.removeTodos(completedTodos.map((todo) => todo.id));
    if (removed) {
      announce(announcer, '완료된 할 일을 모두 삭제했습니다.');
    }
  } catch {
    announce(announcer, '완료된 할 일 삭제 중 오류가 발생했습니다.');
  }
}

form.addEventListener('submit', handleAddTodo);
toolbar.addEventListener('click', handleFilterClick);
toolbar.addEventListener('keydown', handleToolbarKeydown);
list.addEventListener('click', handleTodoAction);
list.addEventListener('change', handleTodoToggle);
clearCompletedButton.addEventListener('click', handleClearCompleted);

store.subscribe(updateView);
updateView();
updateView();

async function initializeTodos() {
  try {
    announce(announcer, '서버 TODO 목록을 불러오는 중입니다.');
    const todos = await fetchTodos();
    store.setTodos(todos);
    announce(announcer, '서버에서 TODO 목록을 불러왔습니다.');
  } catch {
    announce(announcer, '서버 연결에 실패해 로컬 데이터를 표시합니다.');
  }
}

initializeTodos();