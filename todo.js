let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');

addBtn.addEventListener('click', () => {
    const content = todoInput.value;
    if (content) {
        addTodo(content);
        todoInput.value = '';
    }
});

function addTodo(content) {
    if (!content) return;
    const nextID = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    const newTodo = {id: nextID, content: content, done: false};
    todos.push(newTodo);
    saveAndrender();
}

function saveAndrender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
}

function render() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.done ? 'todo-item completed' : 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.done ? 'checked' : ''} onclick="toggleTodo(${todo.id})">
            <span>${todo.content}</span>
            <button onclick="deleteTodo(${todo.id})">🗑️</button>
        `;
        todoList.appendChild(li);
    });
}

function toggleTodo(id) {
    const todo = todos.find(item => item.id === id);
    if (todo) {
        todo.done = !todo.done;
        saveAndrender();
    }
}

function deleteTodo(id) {
    todos = todos.filter(item => item.id !== id);
    saveAndrender();
}

render();