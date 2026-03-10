const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const FILE_NAME = 'todos.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Read todos from the JSON file, returning an empty array on failure
function loadTodos() {
  if (!fs.existsSync(FILE_NAME)) return [];
  try { return JSON.parse(fs.readFileSync(FILE_NAME, 'utf8')); }
  catch (e) { return []; }
}

// Persist the todos array to the JSON file
function saveTodos(todos) {
  fs.writeFileSync(FILE_NAME, JSON.stringify(todos, null, 2), 'utf8');
}

// GET all todos
app.get('/api/todos', (req, res) => res.json(loadTodos()));

// POST a new todo
app.post('/api/todos', (req, res) => {
  const todos = loadTodos();
  const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  const newTodo = { id: newId, content: req.body.content, done: false };
  todos.push(newTodo);
  saveTodos(todos);
  res.json(newTodo);
});

// PATCH toggle the done status of a todo
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    todo.done = !todo.done;
    saveTodos(todos);
  }
  res.json(todo);
});

// DELETE a todo by id
app.delete('/api/todos/:id', (req, res) => {
  let todos = loadTodos();
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  saveTodos(todos);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
