import { implDateUsecase } from './application/date-usecase.js';
import { implTodoUsecase } from './application/todo-usecase.js';
import { implDateRepository } from './infrastructure/date-repository.js';
import { implTodoRepository } from './infrastructure/todo-repository.js';

import { TodoApp } from './interface/components/todo-app.js';

const todoRepository = implTodoRepository();
const dateRepository = implDateRepository();
const todoUsecase = implTodoUsecase({ todoRepository });
const dateUsecase = implDateUsecase({ dateRepository });

const app = new TodoApp();
app.todoUsecase = todoUsecase;
app.dateUsecase = dateUsecase;
document.body.appendChild(app);
