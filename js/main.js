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

  const todoId = Number(event.target.dataset.id);
  const action = event.target.dataset.action;

  if (action === "edit") {
    const todo = window.todoState.todos.find((item) => item.id === todoId);

    if (!todo) {
      return;
    }

    const nextText = window.prompt("Edit task", todo.text);

    if (nextText === null) {
      return;
    }

    const trimmedText = nextText.trim();

    if (!trimmedText) {
      return;
    }

    window.todoActions.updateTodo(todoId, trimmedText);
  }

  if (action === "delete") {
    window.todoActions.deleteTodo(todoId);
  }

  render();
});

todoList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  window.todoActions.toggleTodo(Number(event.target.dataset.id));
  render();
});

render();
