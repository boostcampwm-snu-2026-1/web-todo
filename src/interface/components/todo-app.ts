import type { DateUsecase } from '../../domain/date-interface';
import type { TodoUsecase } from '../../domain/todo-interface';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { TodoHeader } from './todo-header';
import { TodoInput } from './todo-input';
import { TodoList } from './todo-list';

@customElement('todo-app')
export class TodoApp extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;
  @inject<DateUsecase>('dateUsecase')
  accessor dateUsecase!: DateUsecase;

  connectedCallback() {
    this.innerHTML = this.template();
    this.injectDependencies();
    this.addEventListener('todo:added', this.handleAdded);
  }

  disconnectedCallback() {
    this.removeEventListener('todo:added', this.handleAdded);
  }

  private injectDependencies() {
    const todoInput = this.querySelector<TodoInput>('todo-input');
    const todoHeader = this.querySelector<TodoHeader>('todo-header');
    const todoList = this.querySelector<TodoList>('todo-list');

    if (todoInput == null) throw new Error('todo-input을 찾을 수 없어요.');
    if (todoHeader == null) throw new Error('todo-header를 찾을 수 없어요.');
    if (todoList == null) throw new Error('todo-list를 찾을 수 없어요.');

    todoInput.todoUsecase = this.todoUsecase;
    todoHeader.dateUsecase = this.dateUsecase;
    todoHeader.render();
    todoList.todoUsecase = this.todoUsecase;
    todoList.render();
  }

  private handleAdded = (e: Event) => {
    if (!(e instanceof CustomEvent)) return;
    this.querySelector('todo-list')?.dispatchEvent(
      new CustomEvent('todo:added', {
        detail: e.detail,
        bubbles: false,
      })
    );
  };

  private template() {
    return /* html */ `
      <div class="background">
        <div class="card">
          <todo-header></todo-header>
          <todo-input></todo-input>
          <todo-list></todo-list>
        </div>
      </div>
    `;
  }
}
