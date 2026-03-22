export function render(todos, todoList, todoCount) {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="toggle-check" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button class="delete-btn" data-id="${todo.id}">X</button>
        `;
        todoList.appendChild(li);
    });

    const remaining = todos.filter(t => !t.completed).length;
    todoCount.textContent = remaining;
}

export function displayDate(dateElement) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateElement.textContent = now.toLocaleDateString('ko-KR', options);
}