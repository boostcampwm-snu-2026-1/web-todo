let editingTodoId = null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function startEditingTodo(id) {
  editingTodoId = id;
}

export function stopEditingTodo() {
  editingTodoId = null;
}

export function renderTodos(todos) {
  const list = document.getElementById("todo-list");

  if (todos.length === 0) {
    stopEditingTodo();
    list.innerHTML = '<li class="todo-empty">할 일이 없습니다.</li>';
    return;
  }

  list.innerHTML = todos
    .map(
      (todo) => {
        const isEditing = todo.id === editingTodoId;
        const safeTask = escapeHtml(todo.task);

        return `
          <li class="todo-item ${todo.done ? "is-done" : ""} ${
            isEditing ? "is-editing" : ""
          }">
            ${
              isEditing
                ? `
                  <input
                    class="todo-edit-input"
                    data-id="${todo.id}"
                    type="text"
                    value="${safeTask}"
                    maxlength="200"
                  />
                `
                : `<span class="todo-text">${safeTask}</span>`
            }
            <div class="todo-actions">
              ${
                isEditing
                  ? `
                    <button
                      class="todo-action todo-action--save"
                      type="button"
                      data-action="save-edit"
                      data-id="${todo.id}"
                    >
                      저장
                    </button>
                    <button
                      class="todo-action todo-action--cancel"
                      type="button"
                      data-action="cancel-edit"
                      data-id="${todo.id}"
                    >
                      취소
                    </button>
                  `
                  : `
                    <button
                      class="todo-action todo-action--edit"
                      type="button"
                      data-action="edit"
                      data-id="${todo.id}"
                    >
                      수정
                    </button>
                    <button
                      class="todo-action todo-action--toggle"
                      type="button"
                      data-action="toggle"
                      data-id="${todo.id}"
                    >
                      ${todo.done ? "되돌리기" : "완료"}
                    </button>
                    <button
                      class="todo-action todo-action--delete"
                      type="button"
                      data-action="delete"
                      data-id="${todo.id}"
                    >
                      삭제
                    </button>
                  `
              }
            </div>
          </li>
        `;
      },
    )
    .join("");
}
