

const todoList = [
    { id: 1, text: "Do the laundry", completed: true },
    { id: 2, text: "Buy groceries", completed: false },
];
const todoContainer = document.querySelector(".todo-container");


function renderTodos () {
    todoContainer.innerHTML = "";
    todoList.forEach(todo => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");
        todoItem.innerHTML = `<input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${todo.text}</span>
        <div>
            <button type="button" class="edit-todo-btn">🖋️</button>
            <button type="button" class="delete-todo-btn">🗑️</button>
        </div>`;
        todoContainer.appendChild(todoItem);
    });
};

renderTodos();

const todoInput = document.querySelector("#add-todo-input");
const addTodoBtn = document.querySelector("#add-todo-btn");
addTodoBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});


function addTodo () {
    const text = todoInput.value.trim()
    if (text) {
            const newTodo = {
                id: Date.now(),
                text: text,
                completed: false
            };
            todoList.push(newTodo);
            renderTodos();
            todoInput.value = "";
    };
};

const deleteTodoBtn = document.querySelector(".delete-todo-btn");
deleteTodoBtn.addEventListener("click", deleteTodo);


function deleteTodo () {
};



