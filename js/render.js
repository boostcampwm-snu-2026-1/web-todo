window.renderTodos = function renderTodos(todoList, todos) {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `todo-${todo.id}`;
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = todo.text;

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

    item.append(checkbox, label, editButton, deleteButton);
    todoList.append(item);
  });
};
