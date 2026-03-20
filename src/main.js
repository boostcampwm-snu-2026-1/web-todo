import "./style.css";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./api.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="todo-app">
    <section class="todo-box">
      <h1>Todo List</h1>
      <form id="todo-form" class="todo-form">
        <input id="todo-input" class="todo-input" type="text" placeholder="할 일을 입력하세요" autocomplete="off" />
        <button class="add-button" type="submit">추가</button>
      </form>
      <p id="todo-count" class="todo-count">불러오는 중...</p>
      <p id="todo-message" class="todo-message"></p>
      <ul id="todo-list" class="todo-list"></ul>
    </section>
  </main>
`;

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoCount = document.querySelector("#todo-count");
const todoMessage = document.querySelector("#todo-message");
const todoList = document.querySelector("#todo-list");

let todos = [];

function renderTodos() {
  todoList.innerHTML = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    const toggleButton = document.createElement("button");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    item.className = "todo-item";
    item.dataset.id = todo.id;

    if (todo.done) {
      item.classList.add("done");
    }

    toggleButton.type = "button";
    toggleButton.className = "toggle-button";
    toggleButton.textContent = todo.done ? "취소" : "완료";

    text.className = "todo-text";
    text.textContent = todo.text;

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "삭제";

    item.append(toggleButton, text, deleteButton);
    todoList.append(item);
  }

  const leftCount = todos.filter((todo) => !todo.done).length;
  todoCount.textContent = `전체 ${todos.length}개 / 남은 일 ${leftCount}개`;

  if (!todos.length) {
    todoMessage.textContent = "할 일이 없습니다.";
    return;
  }

  todoMessage.textContent = "";
}

async function loadTodos() {
  todoMessage.textContent = "목록을 불러오는 중입니다.";

  try {
    todos = await getTodos();
    renderTodos();
  } catch (error) {
    todoCount.textContent = "불러오기 실패";
    todoMessage.textContent = "서버 요청에 실패했습니다.";
  }
}

async function addTodo(text) {
  try {
    const newTodo = await createTodo(text);
    todos.unshift(newTodo);
    renderTodos();
    todoInput.value = "";
    todoInput.focus();
  } catch (error) {
    todoMessage.textContent = "추가에 실패했습니다.";
  }
}

async function toggleTodo(id) {
  const target = todos.find((todo) => todo.id === id);

  if (!target) {
    return;
  }

  try {
    const updatedTodo = await updateTodo(target);
    todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
    renderTodos();
  } catch (error) {
    todoMessage.textContent = "상태 변경에 실패했습니다.";
  }
}

async function removeTodo(id) {
  try {
    await deleteTodo(id);
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  } catch (error) {
    todoMessage.textContent = "삭제에 실패했습니다.";
  }
}

async function onSubmit(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  await addTodo(text);
}

async function onListClick(event) {
  const todoItem = event.target.closest(".todo-item");

  if (!todoItem) {
    return;
  }

  const id = todoItem.dataset.id;

  if (event.target.classList.contains("toggle-button")) {
    await toggleTodo(id);
  }

  if (event.target.classList.contains("delete-button")) {
    await removeTodo(id);
  }
}

todoForm.addEventListener("submit", onSubmit);
todoList.addEventListener("click", onListClick);

loadTodos();
