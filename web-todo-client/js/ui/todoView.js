function createActionButton(className, label, text) {
  const buttonElement = document.createElement("button");
  buttonElement.className = className;
  buttonElement.type = "button";
  buttonElement.setAttribute("aria-label", label);
  buttonElement.textContent = text;
  return buttonElement;
}

function createTodoTextElement(todo) {
  const textElement = document.createElement("span");
  textElement.className = "todo-text";
  textElement.textContent = todo.text;

  if (todo.completed) {
    textElement.classList.add("todo-text-done");
  }

  return textElement;
}

function createTodoEditInputElement(todo) {
  const inputElement = document.createElement("input");
  inputElement.className = "todo-edit-input";
  inputElement.type = "text";
  inputElement.value = todo.text;
  inputElement.maxLength = 100;
  inputElement.setAttribute("aria-label", "Edit task");
  return inputElement;
}

function createTodoActionsElement(todo, editingTodoId) {
  const actionsElement = document.createElement("div");
  actionsElement.className = "todo-actions";

  if (editingTodoId === todo.id) {
    actionsElement.appendChild(createActionButton("save-button", "Save task", "✓"));
    actionsElement.appendChild(createActionButton("cancel-button", "Cancel edit", "✕"));
    return actionsElement;
  }

  actionsElement.appendChild(createActionButton("edit-button", "Edit task", "✎"));
  actionsElement.appendChild(createActionButton("delete-button", "Delete task", "🗑"));
  return actionsElement;
}

function createTodoItemElement(todo, editingTodoId) {
  const itemElement = document.createElement("li");
  itemElement.className = "todo-item";
  itemElement.dataset.todoId = String(todo.id);

  if (editingTodoId === todo.id) {
    itemElement.classList.add("todo-item-editing");
  }

  const checkboxElement = document.createElement("input");
  checkboxElement.className = "todo-checkbox";
  checkboxElement.type = "checkbox";
  checkboxElement.checked = Boolean(todo.completed);
  checkboxElement.disabled = editingTodoId === todo.id;
  checkboxElement.setAttribute("aria-label", "Mark task as done");

  const contentElement =
    editingTodoId === todo.id ? createTodoEditInputElement(todo) : createTodoTextElement(todo);

  const actionsElement = createTodoActionsElement(todo, editingTodoId);

  itemElement.appendChild(checkboxElement);
  itemElement.appendChild(contentElement);
  itemElement.appendChild(actionsElement);

  return itemElement;
}

function createEmptyMessageElement() {
  const emptyElement = document.createElement("li");
  emptyElement.className = "todo-item todo-empty";
  emptyElement.textContent = "No tasks yet. Add your first task!";
  return emptyElement;
}

export function renderTodoList(todos, editingTodoId) {
  const listElement = document.getElementById("todo-list");
  if (!listElement) return;

  listElement.textContent = "";

  if (todos.length === 0) {
    listElement.appendChild(createEmptyMessageElement());
    return;
  }

  const fragment = document.createDocumentFragment();
  todos.forEach((todo) => {
    fragment.appendChild(createTodoItemElement(todo, editingTodoId));
  });

  listElement.appendChild(fragment);

  if (editingTodoId !== null) {
    const editInput = listElement.querySelector(".todo-edit-input");
    if (editInput instanceof HTMLInputElement) {
      editInput.focus();
      editInput.select();
    }
  }
}
