const STORAGE_KEY = 'todos';

const inputEl = document.getElementById('new-task-input');
const addBtnEl = document.getElementById('add-task-button');
const listEl = document.getElementById('todo-list');

const getData = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const setData = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const render = () => {
  const todos = getData();
  listEl.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = String(todo.id);

    li.innerHTML = `
      <label>
        <input type="checkbox" ${todo.done ? 'checked' : ''} />
        <span></span>
      </label>
      <div class="todo-actions">
        <button type="button" data-action="edit" aria-label="Edit task">Edit</button>
        <button type="button" data-action="delete" aria-label="Delete task">Delete</button>
      </div>
    `;
    li.querySelector('span').textContent = todo.content;
    listEl.appendChild(li);
  });
};

const addTodo = () => {
  const content = inputEl.value.trim();
  if (!content) return;

  const todos = getData();
  const newId = (todos.length ? Math.max(...todos.map((t) => t.id)) : 0) + 1;
  todos.push({ id: newId, content, done: false });
  setData(todos);

  inputEl.value = '';
  render();
};

const toggleTodo = (id, checked) => {
  const todos = getData();
  const target = todos.find((t) => t.id === id);
  if (!target) return;
  target.done = checked;
  setData(todos);
  render();
};

const deleteTodo = (id) => {
  const todos = getData().filter((t) => t.id !== id);
  setData(todos);
  render();
};

const editTodo = (id) => {
  const todos = getData();
  const target = todos.find((t) => t.id === id);
  if (!target) return;

  const next = prompt('Edit task:', target.content);
  if (next === null) return;

  const content = next.trim();
  if (!content) return;

  target.content = content;
  setData(todos);
  render();
};

addBtnEl.addEventListener('click', addTodo);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

listEl.addEventListener('change', (e) => {
  const li = e.target.closest('.todo-item');
  if (!li || e.target.type !== 'checkbox') return;
  toggleTodo(Number(li.dataset.id), e.target.checked);
});

listEl.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-action]');
  const li = e.target.closest('.todo-item');
  if (!button || !li) return;

  const id = Number(li.dataset.id);
  const action = button.dataset.action;

  if (action === 'delete') deleteTodo(id);
  if (action === 'edit') editTodo(id);
});

render();