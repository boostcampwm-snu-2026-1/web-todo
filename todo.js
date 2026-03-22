

const todoList = [
    { id: 1, text: "Do the laundry", completed: true },
    { id: 2, text: "Buy groceries", completed: false },
];


function renderTodos () {
    const todoContainer = document.querySelector(".task-container");
    todoContainer.innerHTML = "";
    todoList.forEach(todo => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("task-item");
        todoItem.innerHTML = `<input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span class="task-text">${todo.text}</span>
        <div>
            <button type="button" class="edit-task-btn">🖋️</button>
            <button type="button" class="delete-task-btn">🗑️</button>
        </div>`;
        todoContainer.appendChild(todoItem);
    });
};

renderTodos();