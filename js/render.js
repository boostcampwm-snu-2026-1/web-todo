import { getTodosBySection } from './store.js';

const SECTION_LABELS = {
  inbox: 'Inbox',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/**
 * Re-renders all 4 columns on the board.
 * @param {HTMLElement} boardEl
 */
export function renderBoard(boardEl) {
  const columns = boardEl.querySelectorAll('.column');
  columns.forEach(col => {
    const section = col.dataset.section;
    const todos = getTodosBySection(section);
    renderColumn(col, todos);
  });
}

/**
 * Replaces a column's todo list with fresh DOM.
 * @param {HTMLElement} columnEl
 * @param {Todo[]} todos
 */
export function renderColumn(columnEl, todos) {
  const list = columnEl.querySelector('.todo-list');
  const countEl = columnEl.querySelector('.column-count');

  // Update count badge
  if (countEl) {
    const active = todos.filter(t => !t.completed).length;
    countEl.textContent = active > 0 ? active : '';
  }

  // Rebuild list
  list.innerHTML = '';

  if (todos.length === 0) {
    const empty = createElement('li', { className: 'empty-state' });
    empty.textContent = '—';
    list.appendChild(empty);
    return;
  }

  todos.forEach(todo => list.appendChild(createTodoCard(todo)));
}

/**
 * Creates a single todo card <li> element.
 * @param {Todo} todo
 * @returns {HTMLElement}
 */
export function createTodoCard(todo) {
  const li = createElement('li', {
    className: `todo-card${todo.completed ? ' completed' : ''}`,
  });
  setAttribute(li, 'data-id', todo.id);
  setAttribute(li, 'data-section', todo.section);
  setAttribute(li, 'draggable', 'true');

  // Drag handle
  const handle = createElement('span', { className: 'drag-handle' });
  handle.setAttribute('aria-hidden', 'true');
  handle.textContent = '⠿';

  // Text
  const text = createElement('span', { className: 'todo-text' });
  text.textContent = todo.text;

  // Toggle button
  const btnToggle = createElement('button', { className: 'btn-toggle' });
  setAttribute(btnToggle, 'data-action', 'toggle');
  setAttribute(btnToggle, 'data-id', todo.id);
  setAttribute(btnToggle, 'aria-label', todo.completed ? 'Mark incomplete' : 'Mark complete');
  btnToggle.textContent = todo.completed ? '✓' : '○';

  // Delete button
  const btnDelete = createElement('button', { className: 'btn-delete' });
  setAttribute(btnDelete, 'data-action', 'delete');
  setAttribute(btnDelete, 'data-id', todo.id);
  setAttribute(btnDelete, 'aria-label', 'Delete todo');
  btnDelete.textContent = '×';

  li.appendChild(handle);
  li.appendChild(text);
  li.appendChild(btnToggle);
  li.appendChild(btnDelete);

  return li;
}

/**
 * Creates a column shell: header + input area + empty list.
 * @param {'inbox'|'high'|'medium'|'low'} section
 * @returns {HTMLElement}
 */
export function createColumnEl(section) {
  const col = createElement('div', { className: 'column' });
  setAttribute(col, 'data-section', section);

  // Header
  const header = createElement('div', { className: 'column-header' });
  const title = createElement('span', { className: 'column-title' });
  title.textContent = SECTION_LABELS[section];
  const count = createElement('span', { className: 'column-count' });
  header.appendChild(title);
  header.appendChild(count);

  // List
  const list = createElement('ul', { className: 'todo-list' });
  setAttribute(list, 'data-section', section);

  // Input area
  const inputArea = section === 'inbox'
    ? createInboxInput()
    : createColumnInput(section);

  col.appendChild(header);
  col.appendChild(list);
  col.appendChild(inputArea);

  return col;
}

/**
 * Creates the Inbox multi-line textarea dump input area.
 * @returns {HTMLElement}
 */
export function createInboxInput() {
  const wrap = createElement('div', { className: 'column-input-area' });
  const inner = createElement('div', { className: 'inbox-dump-wrap' });

  const textarea = createElement('textarea', { className: 'inbox-textarea' });
  setAttribute(textarea, 'rows', '4');
  setAttribute(textarea, 'placeholder', '할 일을 마구 덤프하세요...\n한 줄에 하나씩');
  setAttribute(textarea, 'data-inbox-textarea', '');

  const hint = createElement('span', { className: 'inbox-hint' });
  hint.textContent = 'Cmd+Enter (Mac) / Ctrl+Enter (Win) 로 추가';

  const btn = createElement('button', { className: 'btn-dump' });
  setAttribute(btn, 'data-action', 'dump');
  btn.textContent = 'Add All';

  inner.appendChild(textarea);
  inner.appendChild(hint);
  inner.appendChild(btn);
  wrap.appendChild(inner);

  return wrap;
}

/**
 * Creates a single-line input for High/Medium/Low columns.
 * @param {'high'|'medium'|'low'} section
 * @returns {HTMLElement}
 */
export function createColumnInput(section) {
  const wrap = createElement('div', { className: 'column-input-area' });
  const inner = createElement('div', { className: 'col-input-wrap' });

  const input = createElement('input', { className: 'col-input' });
  setAttribute(input, 'type', 'text');
  setAttribute(input, 'placeholder', `Add to ${SECTION_LABELS[section]}...`);
  setAttribute(input, 'data-section', section);
  setAttribute(input, 'data-col-input', '');

  inner.appendChild(input);
  wrap.appendChild(inner);

  return wrap;
}

/**
 * Toggles the .completed class on a card without full re-render.
 * @param {string} todoId
 * @param {boolean} completed
 */
export function updateCardCompletion(todoId, completed) {
  const card = document.querySelector(`.todo-card[data-id="${todoId}"]`);
  if (!card) return;

  card.classList.toggle('completed', completed);

  const btn = card.querySelector('.btn-toggle');
  if (btn) {
    btn.textContent = completed ? '✓' : '○';
    setAttribute(btn, 'aria-label', completed ? 'Mark incomplete' : 'Mark complete');
  }
}

/**
 * Removes a card from the DOM without full re-render.
 * Also updates the column count.
 * @param {string} todoId
 */
export function removeCard(todoId) {
  const card = document.querySelector(`.todo-card[data-id="${todoId}"]`);
  if (!card) return;

  const col = card.closest('.column');
  card.remove();

  // Show empty state if list is now empty
  if (col) {
    const list = col.querySelector('.todo-list');
    if (list && list.children.length === 0) {
      const empty = createElement('li', { className: 'empty-state' });
      empty.textContent = '—';
      list.appendChild(empty);
    }
    // Update count
    const section = col.dataset.section;
    const todos = getTodosBySection(section);
    const countEl = col.querySelector('.column-count');
    if (countEl) {
      const active = todos.filter(t => !t.completed).length;
      countEl.textContent = active > 0 ? active : '';
    }
  }
}

// ─── DOM Helpers ────────────────────────────────────────────

/**
 * Creates an element with optional properties.
 * @param {string} tag
 * @param {Object} props
 * @returns {HTMLElement}
 */
function createElement(tag, props = {}) {
  const el = document.createElement(tag);
  Object.assign(el, props);
  return el;
}

/**
 * Sets an attribute on an element.
 * @param {HTMLElement} el
 * @param {string} name
 * @param {string} value
 */
function setAttribute(el, name, value) {
  el.setAttribute(name, value);
}
