import type { DateUsecase } from '../../domain/date-interface';
import type { TodoUsecase } from '../../domain/todo-interface';
import { EVENT_NAMES } from '../assets/event-name';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { ErrorModal } from './error-modal';
import { TodoHeader } from './todo-header';
import { TodoInput } from './todo-input';
import { TodoList } from './todo-list';

@customElement(COMPONENT_TAGS.TODO_APP)
export class TodoApp extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;
  @inject<DateUsecase>('dateUsecase')
  accessor dateUsecase!: DateUsecase;

  connectedCallback() {
    this.innerHTML = this.template();
    this.injectDependencies();
    this.addEventListener(EVENT_NAMES.TODO_ADDED, this.handleAdded);
    this.addEventListener(EVENT_NAMES.TODO_ERROR, this.handleError);
  }

  disconnectedCallback() {
    this.removeEventListener(EVENT_NAMES.TODO_ADDED, this.handleAdded);
    this.removeEventListener(EVENT_NAMES.TODO_ERROR, this.handleError);
  }

  private handleError = (e: Event) => {
    if (!(e instanceof CustomEvent)) return;
    const modal = this.querySelector<ErrorModal>(COMPONENT_TAGS.ERROR_MODAL);
    if (modal === null) {
      return;
    }
    modal.show(e.detail.error);
  };

  private injectDependencies() {
    const todoInput = this.querySelector<TodoInput>(COMPONENT_TAGS.TODO_INPUT);
    const todoHeader = this.querySelector<TodoHeader>(
      COMPONENT_TAGS.TODO_HEADER
    );
    const todoList = this.querySelector<TodoList>(COMPONENT_TAGS.TODO_LIST);

    if (todoInput == null) throw new Error('todo-input을 찾을 수 없어요.');
    if (todoHeader == null) throw new Error('todo-header를 찾을 수 없어요.');
    if (todoList == null) throw new Error('todo-list를 찾을 수 없어요.');

    todoHeader.dateUsecase = this.dateUsecase;
    todoHeader.render();
    todoList.todoUsecase = this.todoUsecase;
    todoList.render();
  }

  private handleAdded = (e: Event) => {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    const todoList = this.querySelector(COMPONENT_TAGS.TODO_LIST);
    if (todoList === null) {
      return;
    }
    todoList.dispatchEvent(
      new CustomEvent(EVENT_NAMES.TODO_ADDED, {
        detail: e.detail,
        bubbles: false,
      })
    );
  };

  private template() {
    return /* html */ `
      <div class="background">
        <div class="card">
          <${COMPONENT_TAGS.TODO_HEADER}></${COMPONENT_TAGS.TODO_HEADER}>
          <${COMPONENT_TAGS.TODO_INPUT}></${COMPONENT_TAGS.TODO_INPUT}>
          <${COMPONENT_TAGS.TODO_LIST}></${COMPONENT_TAGS.TODO_LIST}>
        </div>
      </div>
      <${COMPONENT_TAGS.ERROR_MODAL}></${COMPONENT_TAGS.ERROR_MODAL}>
    `;
  }
}
