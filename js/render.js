// DOM 요소 생성 및 렌더링 담당 모듈

export function renderDate(element) {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  element.textContent = now.toLocaleDateString('en-US', options);
}

export function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'todo-toggle';
  toggleBtn.setAttribute('aria-label', todo.completed ? '완료 해제' : '완료 처리');

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'todo-edit-btn';
  editBtn.setAttribute('aria-label', '수정');
  editBtn.textContent = '✎';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-delete-btn';
  deleteBtn.setAttribute('aria-label', '삭제');
  deleteBtn.textContent = '🗑';

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(toggleBtn);
  li.appendChild(textSpan);
  li.appendChild(actions);

  return li;
}

export function renderTodoList(listElement, todos) {
  listElement.innerHTML = '';
  todos.forEach(todo => {
    listElement.appendChild(createTodoElement(todo));
  });
}
