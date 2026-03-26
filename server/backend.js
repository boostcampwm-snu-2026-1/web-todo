import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;