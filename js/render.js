window.renderTodos = function renderTodos(todoList, todos) {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `todo-${todo.id}`;
    checkbox.checked = todo.completed;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = todo.text;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Delete";
    button.dataset.id = todo.id;

    item.append(checkbox, label, button);
    todoList.append(item);
  });
};
