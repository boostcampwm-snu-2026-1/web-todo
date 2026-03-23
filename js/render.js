export function renderTodos(todoList, todos, editingTodoId) {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "There is no task to do!";
    todoList.append(emptyItem);
    return;
  }

  todos.forEach((todo) => {
    const item = document.createElement("li");
    const isEditing = todo.id === editingTodoId;
    item.dataset.id = todo.id;
    item.draggable = !isEditing;

    const dragHandle = document.createElement("button");
    dragHandle.type = "button";
    dragHandle.className = "drag-handle";
    dragHandle.setAttribute("aria-label", "Drag to reorder");
    dragHandle.setAttribute("tabindex", "-1");
    dragHandle.innerHTML = `
      <span></span><span></span>
      <span></span><span></span>
      <span></span><span></span>
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `todo-${todo.id}`;
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;
    checkbox.disabled = isEditing;

    item.append(dragHandle, checkbox);

    if (isEditing) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = todo.title;
      editInput.dataset.id = todo.id;
      editInput.className = "edit-input";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.textContent = "Save";
      saveButton.dataset.id = todo.id;
      saveButton.dataset.action = "save";
      saveButton.className = "edit-button";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";
      cancelButton.dataset.id = todo.id;
      cancelButton.dataset.action = "cancel";
      cancelButton.className = "edit-button";

      item.append(editInput, saveButton, cancelButton);
    } else {
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = todo.title;

      if (todo.completed) {
        label.classList.add("completed");
      }

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.dataset.id = todo.id;
      editButton.dataset.action = "edit";
      editButton.className = "edit-button";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.dataset.id = todo.id;
      deleteButton.dataset.action = "delete";
      deleteButton.className = "delete-button";

      item.append(label, editButton, deleteButton);
    }

    todoList.append(item);
  });
}
