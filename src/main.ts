import { implDateUsecase } from './application/date-usecase';
import { implTodoUsecase } from './application/todo-usecase';
import { localServerCall } from './infrastructure/api/api-raw-call';
import { implApiRepository } from './infrastructure/api/apis';
import { implApi } from './infrastructure/api/client';
import { implDateRepository } from './infrastructure/date-repository';
import { implTodoRepository } from './infrastructure/todo-repository';

import { TodoApp } from './interface/components/todo-app';

const { callWithoutToken } = implApi({ rawCall: localServerCall });
const apiRepository = implApiRepository({ callWithoutToken });

const todoRepository = implTodoRepository({ apiRepository });
const dateRepository = implDateRepository();
const todoUsecase = implTodoUsecase({ todoRepository });
const dateUsecase = implDateUsecase({ dateRepository });

const app = new TodoApp();
app.todoUsecase = todoUsecase;
app.dateUsecase = dateUsecase;
document.body.appendChild(app);
