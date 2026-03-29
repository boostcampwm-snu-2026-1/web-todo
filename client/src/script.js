import { getTodo, addTodo, deleteTodo, checkTodo } from "./api.js";

const todoForm = document.getElementById("form");
const todoInput = document.getElementById("input");
const todoList = document.getElementById("todo-list");

let todos = [];

async function loadTodos() {
  todos = await getTodo();
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = todo.done;

    const span = document.createElement("span");
    span.textContent = todo.content;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "삭제";
    deleteBtn.className = "deleteBtn";

    deleteBtn.addEventListener("click", async () => {
      await deleteTodo(todo._id);
      await loadTodos();
    });

    checkbox.addEventListener("change", async () => {
      await checkTodo(todo._id, checkbox.checked);
      await loadTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (text === "") return;

  await addTodo(text);
  todoInput.value = "";
  await loadTodos();
});

loadTodos();