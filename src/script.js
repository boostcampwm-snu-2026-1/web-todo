import { getTodo, addTodo, deleteTodo } from "./api";

const todoForm = document.getElementById("form");
const todoInput = document.getElementById("input");
const todoList = document.getElementById("todo-list");

let todos = await getTodo();

function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((todo) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = todo.completed;

        const span = document.createElement("span");
        span.textContent = todo.content;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button"
        deleteBtn.textContent = "삭제";
        deleteBtn.className = "deleteBtn";

        deleteBtn.addEventListener("click", async () => {
            await deleteTodo(todo.id);
            todos = await getTodo();
            renderTodos();
        })

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            renderTodos();
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
    if (text === "")return;

    await addTodo(text);
    todos = await getTodo();
    todoInput.value = "";
    renderTodos();
});

renderTodos();