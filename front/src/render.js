/** Create a single todo list item element */
export function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.done ? 'done' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.className = 'toggle-checkbox';

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.content;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '삭제';

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

/** Render the full todo list into the given container */
export function renderTodoList(todos, container) {
  container.innerHTML = '';

  // Use DocumentFragment to minimize reflows
  const fragment = document.createDocumentFragment();

  todos.forEach(todo => {
    const todoEl = createTodoElement(todo);
    fragment.appendChild(todoEl);
  });

  container.appendChild(fragment);
}
