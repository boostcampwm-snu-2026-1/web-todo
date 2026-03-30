export const renderTodoList = (listEl, todos) => {
  listEl.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = String(todo.id);

    li.innerHTML = `
      <label>
        <input type="checkbox" ${todo.done ? 'checked' : ''} />
        <span></span>
      </label>
      <div class="todo-actions">
        <button type="button" data-action="edit" aria-label="Edit task">Edit</button>
        <button type="button" data-action="delete" aria-label="Delete task">Delete</button>
      </div>
    `;

    li.querySelector('span').textContent = todo.content;
    listEl.appendChild(li);
  });
};
