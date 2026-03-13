const todos = [
    { id: 1, text: "회의 메모 준비하기", completed: false },
    { id: 2, text: "프론트엔드 DOM API 복습하기", completed: false },
    { id: 3, text: "첫 커밋 푸시하기", completed: true },
];

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
    toggleButton.setAttribute("aria-label", "할 일 완료 상태 전환");
    toggleButton.textContent = todo.completed ? "✓" : "";

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
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

function createNewTodo(text) {
    return {
        id: Date.now(),
        text: text,
        completed: false,
    };
}

function addTodo() {
    const inputValue = todoInputElement.value.trim();

    if (inputValue === "") {
        return;
    }

    const newTodo = createNewTodo(inputValue);
    todos.push(newTodo);

    renderTodoList();
    todoInputElement.value = "";
    todoInputElement.focus();
}

addButtonElement.addEventListener("click", addTodo);

todoInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});

renderTodoList();