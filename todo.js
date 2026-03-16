const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

let todos = [
  { id: 1, text: "HTML 구조 이해하기", completed: false },
  { id: 2, text: "CSS로 레이아웃 만들기", completed: true },
];

function createTodoItem(todo) {
  return `
    <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${todo.id}">
      <div class="todo-left">
        <input
          type="checkbox"
          class="todo-checkbox"
          ${todo.completed ? "checked" : ""}
        />
        <span class="todo-text">${todo.text}</span>
      </div>
      <button class="todo-delete-button">삭제</button>
    </li>
  `;
}

function renderTodos() {
  const todoItemsHtml = todos.map(createTodoItem).join("");
  todoList.innerHTML = todoItemsHtml;
}

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  todos.push(newTodo);
  renderTodos();
}

function toggleTodo(todoId) {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }
    return todo;
  });

  renderTodos();
}

function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text === "") {
    return;
  }

  addTodo(text);
  todoInput.value = "";
  todoInput.focus();
});

todoList.addEventListener("change", (event) => {
  if (event.target.classList.contains("todo-checkbox")) {
    const li = event.target.closest(".todo-item");
    const id = Number(li.dataset.id);
    toggleTodo(id);
  }
});

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-delete-button")) {
    const li = event.target.closest(".todo-item");
    const id = Number(li.dataset.id);
    deleteTodo(id);
  }
});

renderTodos();