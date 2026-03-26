export function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    const todoCount = document.getElementById('todo-count');
    
    if (!todoList || !todoCount) return;

    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        li.dataset.id = todo.id; 

        li.innerHTML = `
            <input type="checkbox" class="toggle-checkbox" ${todo.done ? 'checked' : ''}>
            <span class="todo-content">${todo.content}</span>
            <button class="delete-btn">삭제</button>
        `;

        todoList.appendChild(li);
    });

    todoCount.textContent = `전체 ${todos.length}개`;
}

export function displayDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const now = new Date();
    const options = { 
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
    };
    
    dateElement.textContent = now.toLocaleDateString('ko-KR', options);
}