const todoForm = document.getElementById("form");
const todoInput = document.getElementById("input");
const todoList = document.getElementById("todo-list");

let todos = [];
let currentId = 1;

function renderTodos() {
    todos.forEach((todo) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        const span = document.createElement("span");
        span.value = todo.content;

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            renderTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        todoList.appendChild(li);
    });
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    if (text === "")return;

    const newTodo = {
        id: ++currentId,
        content: text,
        completed: false,
    };

    todos.push(newTodo);
    todoInput.value = "";
    renderTodos();
});

renderTodos();