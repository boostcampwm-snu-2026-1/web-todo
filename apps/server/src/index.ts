import express from 'express';
import { implTodoController } from './application/todo-controller.js';
import { implTodoService } from './application/todo-service.js';
import { connectDB } from './infrastructure/db-connect.js';
import { DB_URI } from './infrastructure/env-connect.js';
import { implTodoRepository } from './infrastructure/todo-repository.js';
import { implTodoRouter } from './interface/todo-route.js';

const app = express();
const port = 3000;

const todoRepository = implTodoRepository();
const todoService = implTodoService({ todoRepository });
const todoController = implTodoController({ todoService });
const todoRouter = implTodoRouter({ todoController });

connectDB(DB_URI)
  .then(() => {
    console.log('DB 연결 성공');
    app.listen(port, () => console.log('서버 시작'));
  })
  .catch((error) => {
    console.error('DB 연결 실패', error);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.json());
app.use('/api/todos', todoRouter);
