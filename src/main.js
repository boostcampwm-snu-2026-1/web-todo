const API_URL = "http://localhost:3000/todos";

let todos = [];

const todoListElement = document.querySelector("#todo-list");
const todoInputElement = document.querySelector("#todo-input");
const addButtonElement = document.querySelector("#add-btn");

function createTodoItem(todo) {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    if (todo.completed) {
        todoItem.classList.add("completed");
    }

    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle-btn";
    toggleButton.type = "button";
    toggleButton.dataset.id = todo.id;
    toggleButton.setAttribute("aria-label", "할 일 완료 상태 전환");
    toggleButton.textContent = todo.completed ? "✓" : "";

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.content;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.dataset.id = todo.id;
    deleteButton.textContent = "삭제";

    todoActions.appendChild(deleteButton);

    todoItem.appendChild(toggleButton);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoActions);

    return todoItem;
}

function renderTodoList() {
    todoListElement.innerHTML = "";

    todos.forEach((todo) => {
        const todoItemElement = createTodoItem(todo);
        todoListElement.appendChild(todoItemElement);
    });
}

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to load todos");
        }
        todos = await response.json();
        renderTodoList();
    } catch (error) {
        console.error(error);
    }
}

async function addTodo() {
    const inputValue = todoInputElement.value.trim();

    if (inputValue === "") {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: inputValue }),
        });

        if (!response.ok) {
            throw new Error("Failed to create todo");
        }

        const newTodo = await response.json();
        todos.unshift(newTodo);
        renderTodoList();

        todoInputElement.value = "";
        todoInputElement.focus();
    } catch (error) {
        console.error(error);
    }
}

async function toggleTodo(todoId) {
    const targetTodo = todos.find((todo) => todo.id === todoId);

    if (!targetTodo) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${todoId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !targetTodo.completed }),
        });

        if (!response.ok) {
            throw new Error("Failed to update todo");
        }

        const updatedTodo = await response.json();
        todos = todos.map((todo) => (todo.id === todoId ? updatedTodo : todo));
        renderTodoList();
    } catch (error) {
        console.error(error);
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`${API_URL}/${todoId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }

        todos = todos.filter((todo) => todo.id !== todoId);
        renderTodoList();
    } catch (error) {
        console.error(error);
    }
}

if (!window.__todoAppInitialized) {
    window.__todoAppInitialized = true;

    addButtonElement.addEventListener("click", addTodo);

    todoInputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    todoListElement.addEventListener("click", (event) => {
        if (event.target.classList.contains("toggle-btn")) {
            const todoId = event.target.dataset.id;
            toggleTodo(todoId);
            return;
        }

        if (event.target.classList.contains("delete-btn")) {
            const todoId = event.target.dataset.id;
            deleteTodo(todoId);
            return;
        }
    });

    fetchTodos();
}
