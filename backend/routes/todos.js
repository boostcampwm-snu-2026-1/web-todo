const { Router } = require('express');
const Todo = require('../models/Todo');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const todo = await Todo.create({ text: text.trim() });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'todo not found' });
    }

    todo.done = !todo.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'todo not found' });
    }
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'todo not found' });
    }

    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'todo not found' });
    }
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
