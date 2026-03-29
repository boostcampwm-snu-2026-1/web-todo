import mongoose, { Types } from 'mongoose';
import type { Todo } from '../domain/todo/todo.js';
import type { TodoRepository } from '../domain/todo/todo-repository.js';

const todoSchema = new mongoose.Schema({
  content: String,
  done: Boolean,
});

const TodoModel = mongoose.model('Todos', todoSchema);

const toTodo = (doc: {
  _id: Types.ObjectId;
  content?: string | null;
  done?: boolean | null;
}): Todo => ({
  id: doc._id.toString(),
  content: doc.content ?? '',
  done: doc.done ?? false,
});

export const implTodoRepository = (): TodoRepository => ({
  findAll: async () => {
    const docs = await TodoModel.find();
    return docs.map(toTodo);
  },

  findById: async (id) => {
    const doc = await TodoModel.findById(id);
    return doc ? toTodo(doc) : null;
  },

  create: async (content) => {
    const todo = new TodoModel({ content, done: false });
    return toTodo(await todo.save());
  },

  updateContent: async (id, content) => {
    const doc = await TodoModel.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );
    return doc ? toTodo(doc) : null;
  },

  toggleDone: async (id) => {
    const todo = await TodoModel.findById(id);
    if (todo === null) return null;
    todo.done = !todo.done;
    return toTodo(await todo.save());
  },

  deleteById: async (id) => {
    const doc = await TodoModel.findByIdAndDelete(id);
    return doc ? toTodo(doc) : null;
  },
});
