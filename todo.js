const API_URL = "http://localhost:3000/todos";
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');

// 1. 초기 데이터 불러오기
async function fetchTodos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    render(data);
}

// 2. 할 일 추가
addBtn.addEventListener('click', async () => {
    const content = todoInput.value;
    if (content) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        todoInput.value = '';
        fetchTodos();
    }
});

// 3. 상태 변경 (Toggle)
async function toggleTodo(id, currentDone) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDone })
    });
    fetchTodos();
}

// 4. 삭제
async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
}

function render(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.done ? 'todo-item completed' : 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.done ? 'checked' : ''} 
                   onclick="toggleTodo('${todo._id}', ${todo.done})">
            <span>${todo.content}</span>
            <button class="delete-btn" onclick="deleteTodo('${todo._id}')">🗑️</button>
        `;
        todoList.appendChild(li);
    });
}

fetchTodos();