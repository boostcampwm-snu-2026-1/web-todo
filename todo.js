const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyMessage = document.querySelector("#empty-message");

let todos = [];

function makeTodo(text) {
  return {
    id: Date.now(),
    text,
    done: false,
  };
}

function updateView() {
  todoList.innerHTML = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    const toggleButton = document.createElement("button");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    item.className = "todo-item";
    item.dataset.id = todo.id;

    if (todo.done) {
      item.classList.add("is-done");
    }

    toggleButton.type = "button";
    toggleButton.className = "toggle-button";
    toggleButton.textContent = todo.done ? "완료" : "체크";

    text.className = "todo-text";
    text.textContent = todo.text;

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "삭제";

    item.append(toggleButton, text, deleteButton);
    todoList.append(item);
  }

  const leftCount = todos.filter((todo) => !todo.done).length;
  todoCount.textContent = `남은 할 일 ${leftCount}개`;
  emptyMessage.classList.toggle("hide", todos.length > 0);
}

function addTodo(text) {
  const newTodo = makeTodo(text);
  todos.unshift(newTodo);
  updateView();
}

function toggleTodo(id) {
  const target = todos.find((todo) => todo.id === id);

  if (!target) {
    return;
  }

  target.done = !target.done;
  updateView();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  updateView();
}

function onSubmit(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  addTodo(text);
  todoInput.value = "";
  todoInput.focus();
}

function onListClick(event) {
  const todoItem = event.target.closest(".todo-item");

  if (!todoItem) {
    return;
  }

  const id = Number(todoItem.dataset.id);

  if (event.target.classList.contains("toggle-button")) {
    toggleTodo(id);
  }

  if (event.target.classList.contains("delete-button")) {
    removeTodo(id);
  }
}

async function loadTodos() {
  try {
    const response = await fetch("./data/todos.json");

    if (!response.ok) {
      throw new Error("load fail");
    }

    todos = await response.json();
  } catch (error) {
    todos = [
      { id: 1, text: "할 일을 적어보기", done: false },
      { id: 2, text: "끝난 일은 체크하기", done: true },
    ];
  }

  updateView();
}

todoForm.addEventListener("submit", onSubmit);
todoList.addEventListener("click", onListClick);

loadTodos();
