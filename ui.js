export function render(todos, todoList, todoCount) {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" class="toggle-check">
            <span>${todo.text}</span>
            <button class="delete-btn" data-id="${todo.id}">삭제</button>
        `;
        todoList.appendChild(li);
    });

    const remaining = todos.filter(t => !t.completed).length;
    todoCount.textContent = remaining;
}