const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

function render() {
  window.renderTodos(todoList, window.todoState.todos);
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  window.todoActions.addTodo(text);
  todoInput.value = "";
  render();
});

todoList.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  window.todoActions.deleteTodo(Number(event.target.dataset.id));
  render();
});

render();
