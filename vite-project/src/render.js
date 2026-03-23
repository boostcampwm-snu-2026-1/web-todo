export function renderTodos(container, todos) {
  if (todos.length === 0) {
    container.innerHTML = `<li class="empty-message">등록된 할 일이 없습니다.</li>`;
    return;
  }

  container.innerHTML = todos
    .map(
      (todo) => `
        <li class="todo-item" data-id="${todo.id}">
          <div class="todo-left">
            <input
              type="checkbox"
              class="todo-checkbox"
              ${todo.completed ? 'checked' : ''}
            />
            <span class="todo-title ${todo.completed ? 'completed' : ''}">
              ${todo.title}
            </span>
          </div>
          <button class="delete-button">삭제</button>
        </li>
      `
    )
    .join('');
}