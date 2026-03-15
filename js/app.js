import TodoModel from './TodoModel.js';
import TodoView from './TodoView.js';
import TodoController from './TodoController.js';

const app = new TodoController(new TodoModel(), new TodoView());