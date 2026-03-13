import { fetchTodos, createTodo, toggleTodo, deleteTodo } from './api.js';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const countAll = document.querySelector('#count-all');
const countActive = document.querySelector('#count-active');

let todos = [];
let currentFilter = 'all'

function render() {
    const filtered = todos.sfilter(todo => {
        if (currentFilter === 'active') return !todo.done;
        if (currentFilter === 'done') return todo.done;
        return true;
    });

    list.innerHTML = '';
    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (todo.done) li.classList.add('done');
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;

        const span = document.createElement('span');
        span.classList.add('todo-text');
        span.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-delete');
        deleteBtn.textContent = '✕';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    })

    countAll.textContent = todos.length;
    countActive.textContent = todos.filter(t => !t.done).length;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    const newTodo = await createTodo(title);
    todos.push(newTodo);
    input.value = '';
    render();
});

list.addEventListener('click', async (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const id = Number(li.dataset.id);

    if (e.target.matches('.btn-delete')) {
        await deleteTodo(id);
        todos = todos.filter(t => t.id !== id);
        render();
        return;
    }

    if (e.target.matches('input[type="checkbox"]')) {
        const todo = todos.find(t => t.id === id);
        const updated = await toggleTodo(id, todo.done);
        todos = todos.map(t => t.id === id ? updated : t);
        render();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentFilter = btn.dataset.filter;
        render();
    });
});

async function init() {
    todos = await fetchTodos();
    render();
}

init();


