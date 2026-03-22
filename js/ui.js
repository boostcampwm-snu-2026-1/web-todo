let editingTodoId = null;

const editingActions = [
  { action: "save-edit", label: "저장" },
  { action: "cancel-edit", label: "취소" },
];

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

function renderActionButton(todoId, action, label) {
  return `
    <button
      class="todo-action"
      type="button"
      data-action="${action}"
      data-id="${todoId}"
    >
      ${label}
    </button>
  `;
}

function renderTodoContent(todoId, safeTask, isEditing) {
  if (!isEditing) {
    return `<span class="todo-text">${safeTask}</span>`;
  }

  return `
    <input
      class="todo-edit-input"
      data-id="${todoId}"
      type="text"
      value="${safeTask}"
      maxlength="200"
    />
  `;
}

function renderTodoActions(todo, isEditing) {
  if (isEditing) {
    return editingActions
      .map(({ action, label }) => renderActionButton(todo.id, action, label))
      .join("");
  }

  return [
    { action: "edit", label: "수정" },
    { action: "toggle", label: todo.done ? "되돌리기" : "완료" },
    { action: "delete", label: "삭제" },
  ]
    .map(({ action, label }) => renderActionButton(todo.id, action, label))
    .join("");
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
            ${renderTodoContent(todo.id, safeTask, isEditing)}
            <div class="todo-actions">${renderTodoActions(todo, isEditing)}</div>
          </li>
        `;
      },
    )
    .join("");
}
