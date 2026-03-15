const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');

let todos = [];

// 1. Todo를 추가한다
function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.push(newTodo);
    render();
}

// 2. Todo를 삭제한다
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    render();
}

// 3. Todo의 완료 상태를 토글한다
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    render();
}

// 4. Todo 리스트를 랜더링한다
function render() {
    todoList.innerHTML = ''; // 기존 리스트 초기화해야 함

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="handleToggle(${todo.id})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="handleDelete(${todo.id})">X</button>
        `;
        
        todoList.appendChild(li);
    });

    // 남은 할 일 개수 업데이트
    const remaining = todos.filter(t => !t.completed).length;
    todoCount.textContent = remaining;
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text !== '') {
        addTodo(text);
        todoInput.value = ''; 
    }
});

window.handleDelete = deleteTodo;
window.handleToggle = toggleTodo;