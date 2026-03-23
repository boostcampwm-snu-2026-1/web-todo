import './todo.css';
import {
  fetchTodoList,
  createTodoOnServer,
  replaceTodoOnServer,
  deleteTodoOnServer,
} from './api/todos.js';

let todos = [];
let editingId = null;

function getEditingId() {
  return editingId;
}

function setEditingId(id) {
  editingId = id;
}

function normalizeServerTodo(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = Reflect.get(raw, 'id');
  if (id == null) return null;
  const content = Reflect.get(raw, 'content');
  const completed = Reflect.get(raw, 'completed');
  return {
    id: String(id),
    text: typeof content === 'string' ? content : String(content ?? ''),
    done: Boolean(completed),
  };
}

function getTodos() {
  return todos;
}

function getInputElement() {
  return document.getElementById('todo-input');
}

function getInputValue() {
  const el = getInputElement();
  return el ? el.value : '';
}

function clearInput() {
  const el = getInputElement();
  if (el) el.value = '';
}

function getListElement() {
  return document.getElementById('todo-list');
}

function getStatusElement() {
  return document.getElementById('app-status');
}

function setAppStatus(message, isError) {
  const el = getStatusElement();
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('app-status--error', Boolean(isError));
}

function clearAppStatus() {
  setAppStatus('', false);
}

function setFormBusy(busy) {
  const form = document.getElementById('todo-form');
  const input = getInputElement();
  const submitBtn = form?.querySelector('button[type="submit"]');
  if (input) input.disabled = busy;
  if (submitBtn) submitBtn.disabled = busy;
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.setAttribute('data-id', todo.id);
  if (todo.done) li.classList.add('todo-item--done');

  const isEditing = todo.id === getEditingId();

  if (isEditing) {
    li.classList.add('todo-item--editing');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'todo-check';
    check.checked = todo.done;
    check.setAttribute('aria-label', '완료 토글');
    check.setAttribute('data-action', 'toggle');
    check.disabled = true;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-edit-input';
    input.value = todo.text;
    input.setAttribute('data-action', 'edit-input');
    input.setAttribute('aria-label', '할 일 수정');

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--save';
    saveBtn.textContent = '저장';
    saveBtn.setAttribute('aria-label', '저장');
    saveBtn.setAttribute('data-action', 'save');

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn--cancel';
    cancelBtn.textContent = '취소';
    cancelBtn.setAttribute('aria-label', '취소');
    cancelBtn.setAttribute('data-action', 'cancel');

    li.appendChild(check);
    li.appendChild(input);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);

    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelBtn.click();
      }
    });

    return li;
  }

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'todo-check';
  check.checked = todo.done;
  check.setAttribute('aria-label', '완료 토글');
  check.setAttribute('data-action', 'toggle');

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn--edit';
  editBtn.textContent = '편집';
  editBtn.setAttribute('aria-label', '편집');
  editBtn.setAttribute('data-action', 'edit');

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn btn--delete';
  delBtn.textContent = '삭제';
  delBtn.setAttribute('aria-label', '삭제');
  delBtn.setAttribute('data-action', 'delete');

  li.appendChild(check);
  li.appendChild(text);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  return li;
}

function renderTodoList() {
  const listEl = getListElement();
  if (!listEl) return;
  const items = getTodos();
  listEl.replaceChildren(...items.map(createTodoElement));
}

function getEditInputValue(item) {
  const input = item?.querySelector('.todo-edit-input');
  return input ? input.value : '';
}

async function loadTodosFromServer() {
  const rawList = await fetchTodoList();
  const mapped = rawList.map(normalizeServerTodo).filter((t) => t !== null);
  todos = mapped;
  clearAppStatus();
  renderTodoList();
}

async function handleSubmit(e) {
  e.preventDefault();
  const value = getInputValue().trim();
  if (!value) return;
  setFormBusy(true);
  clearAppStatus();
  try {
    const created = await createTodoOnServer({ content: value, completed: false });
    const ui = normalizeServerTodo(created);
    if (ui) todos.push(ui);
    clearInput();
    renderTodoList();
  } catch (err) {
    const msg = err instanceof Error ? err.message : '할 일을 추가하지 못했습니다.';
    setAppStatus(msg, true);
  } finally {
    setFormBusy(false);
  }
}

async function handleListClick(e) {
  const target = e.target instanceof HTMLElement ? e.target : null;
  if (!target) return;
  const item = target.closest('.todo-item');
  if (!item) return;
  const id = item.getAttribute('data-id');
  if (!id) return;
  const action = target.getAttribute('data-action');

  if (action === 'toggle') {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    clearAppStatus();
    try {
      const updated = await replaceTodoOnServer(id, {
        content: todo.text,
        completed: !todo.done,
      });
      const ui = normalizeServerTodo(updated);
      if (ui) {
        const idx = todos.findIndex((t) => t.id === id);
        if (idx !== -1) todos[idx] = ui;
      }
      renderTodoList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '상태를 바꾸지 못했습니다.';
      setAppStatus(msg, true);
    }
    return;
  }

  if (action === 'delete') {
    clearAppStatus();
    try {
      await deleteTodoOnServer(id);
      todos = todos.filter((t) => t.id !== id);
      setEditingId(null);
      renderTodoList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '삭제하지 못했습니다.';
      setAppStatus(msg, true);
    }
    return;
  }

  if (action === 'edit') {
    setEditingId(id);
    renderTodoList();
    return;
  }

  if (action === 'save') {
    const value = getEditInputValue(item).trim();
    if (!value) {
      setAppStatus('내용을 입력하세요.', true);
      return;
    }
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    clearAppStatus();
    try {
      const updated = await replaceTodoOnServer(id, {
        content: value,
        completed: todo.done,
      });
      const ui = normalizeServerTodo(updated);
      if (ui) {
        const idx = todos.findIndex((t) => t.id === id);
        if (idx !== -1) todos[idx] = ui;
      }
      setEditingId(null);
      renderTodoList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장하지 못했습니다.';
      setAppStatus(msg, true);
    }
    return;
  }

  if (action === 'cancel') {
    setEditingId(null);
    renderTodoList();
  }
}

function renderTodayDate() {
  const el = document.getElementById('today-date');
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleDateString('ko-KR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function init() {
  renderTodayDate();
  const form = document.getElementById('todo-form');
  const list = getListElement();
  if (form) form.addEventListener('submit', (e) => void handleSubmit(e));
  if (list) list.addEventListener('click', (e) => void handleListClick(e));

  try {
    await loadTodosFromServer();
  } catch (err) {
    const msg = err instanceof Error ? err.message : '목록을 불러오지 못했습니다.';
    setAppStatus(msg, true);
    todos = [];
    renderTodoList();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init());
} else {
  void init();
}
