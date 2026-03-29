export function createTodoElement(todo) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  if (todo.done) li.classList.add('completed');
  li.dataset.id = todo.id;

  const checkbox = Object.assign(document.createElement('input'), {
    type: 'checkbox',
    className: 'todo-checkbox',
    checked: todo.done,
  });
  checkbox.setAttribute('aria-label', `완료: ${todo.content}`);

  const span = Object.assign(document.createElement('span'), {
    className: 'todo-text',
    textContent: todo.content,
  });

  const deleteBtn = Object.assign(document.createElement('button'), {
    className: 'delete-btn',
    textContent: '🗑',
  });
  deleteBtn.setAttribute('aria-label', '삭제');

  const actions = Object.assign(document.createElement('div'), {
    className: 'item-actions',
  });
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);
  return li;
}

export function renderTodo(todo) {
  const list = document.getElementById('todo-list');
  list.appendChild(createTodoElement(todo));
}

export function removeTodoElement(id) {
  const item = document.getElementById('todo-list').querySelector(`[data-id="${id}"]`);
  if (item) item.remove();
}

export function updateTodoElement(id, completed) {
  const item = document.getElementById('todo-list').querySelector(`[data-id="${id}"]`);
  if (!item) return;
  item.classList.toggle('completed', completed);
  const checkbox = item.querySelector('.todo-checkbox');
  if (checkbox) checkbox.checked = completed;
}
