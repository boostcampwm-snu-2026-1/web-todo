import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);



app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/todos', async (req, res) => {
  const { text, completed } = req.body;
  try {
    const newTodo = new Todo({ text, completed });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).send('Error adding todo');
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send('Todo not found');

    todo.completed = !todo.completed; // 완료 상태 변경
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(400).send('Error updating todo');
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send('Todo not found');

    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(400).send('Error deleting todo');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
