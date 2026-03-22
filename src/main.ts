import { implDateUsecase } from './application/date-usecase';
import { implTodoUsecase } from './application/todo-usecase';
import { implDateRepository } from './infrastructure/date-repository';
import { implIndexedDBRepository } from './infrastructure/db-repository';
import { implTodoRepository } from './infrastructure/todo-repository';

import { TodoApp } from './interface/components/todo-app';

const STORE_NAME = 'todos';

const indexedDBRepository = implIndexedDBRepository({ storeName: STORE_NAME });
const todoRepository = implTodoRepository({ indexedDBRepository });
const dateRepository = implDateRepository();
const todoUsecase = implTodoUsecase({ todoRepository });
const dateUsecase = implDateUsecase({ dateRepository });

const app = new TodoApp();
app.todoUsecase = todoUsecase;
app.dateUsecase = dateUsecase;
document.body.appendChild(app);
