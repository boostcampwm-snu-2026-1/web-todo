import { todos } from "./state.js";

export function renderTodos(todoList) {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.dataset.id = todo.id;

    const span = document.createElement("span");
    span.textContent = todo.content;

    if (todo.done) {
      span.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.classList.add("toggle");

    const button = document.createElement("button");
    button.textContent = "삭제";
    button.classList.add("delete");

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(button);

    todoList.appendChild(li);
  });
}