/**
 * dom.js
 * DOM 엘리먼트 생성 및 조작 모듈 (단일책임: UI 렌더링)
 */

/** todo 아이템 <li> 엘리먼트 생성 */
export const createTodoElement = (todo) => {
  const li = document.createElement('li');
  li.className = `todo-item${todo.done ? ' todo-item--done' : ''}`;
  li.dataset.id = todo.id;
  li.setAttribute('role', 'listitem');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-item__checkbox';
  checkbox.checked = todo.done;
  checkbox.setAttribute('aria-label', `완료 토글: ${todo.text}`);
  checkbox.dataset.action = 'toggle';

  const span = document.createElement('span');
  span.className = 'todo-item__text';
  span.textContent = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-item__delete';
  deleteBtn.setAttribute('aria-label', `삭제: ${todo.text}`);
  deleteBtn.dataset.action = 'delete';
  deleteBtn.innerHTML = '&times;';

  li.append(checkbox, span, deleteBtn);
  return li;
};

/** todo 목록 전체 렌더링 */
export const renderTodoList = (listEl, todos) => {
  listEl.replaceChildren(
    ...todos.map(createTodoElement)
  );
};

/** 특정 아이템의 완료 상태 UI 업데이트 */
export const updateTodoItemUI = (listEl, todo) => {
  const li = listEl.querySelector(`[data-id="${todo.id}"]`);
  if (!li) return;

  li.classList.toggle('todo-item--done', todo.done);
  const checkbox = li.querySelector('[data-action="toggle"]');
  if (checkbox) checkbox.checked = todo.done;
};

/** 통계 텍스트 업데이트 */
export const renderStats = (statsEl, { total, done }) => {
  if (total === 0) {
    statsEl.textContent = '';
    return;
  }
  statsEl.textContent = `전체 ${total}개 · 완료 ${done}개`;
};

/** empty state 표시/숨김 */
export const toggleEmptyState = (emptyEl, isEmpty) => {
  emptyEl.classList.toggle('visible', isEmpty);
};

/** 오늘 날짜 텍스트 렌더링 */
export const renderDate = (dateEl) => {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  dateEl.textContent = now.toLocaleDateString('ko-KR', options);
};
